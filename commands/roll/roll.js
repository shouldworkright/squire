const { SlashCommandBuilder } = require(`discord.js`);

/**
 * Returns a randomly generated number in-between or equal to the min/max
 * @param	{Number}	min	The minimum value that can be generated
 * @param	{Number}	max	The maximum value that can be generated
 * @return	{Number} 
 */
function getRandNum(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

/**
 * Applies an operator to 2 numbers
 * @param	{String}	op	Operator to be applied
 * @param	{Number}	x	First number
 * @param	{Number}	y	Second number
 * @return	{Number}
 */
function applyOperator(op, x, y) {
	
	const supportedOperators =
	{
		"+": (x, y) => x + y,
		"-": (x, y) => x - y
	}
	if (op in supportedOperators)
		return supportedOperators[op](x, y);
}

/**
 * Returns an array of randomly generated numbers
 * @param	{String}	dice	Specifies the quantity of dice, and the number of sides each die has
 * @return	{Array}
 */
function getRolls(dice) {

	// Parse 'dice' string to get die-rolling info
	var re = new RegExp("[0-9]+d[0-9]+");
	if (dice.search(re) != -1) {
		var parsed = dice.split(`d`);
		var quant = parsed[0];	// Quantity of dice being rolled
		var sides = parsed[1];	// Number of sides for each die
	}
	else if (isNaN(dice))
		throw error;
	
	// Generate random number array
	var arr = [];
	for (let i = 0; i < quant; i++) {i
		let cv = getRandNum(1, sides);
		arr[i] = cv;
	}

	return arr;
}

/**
 * Shortens an array of numbers to the 'n' highest numbers
 * @param	{Array}		arr	An array of numbers
 * @param	{Number}	n	The amount of highest numbers returned
 * @return	{Array}
 */
function getHighest(arr, n) {

	// Sort array in descending order, slice off top 'n' numbers
	var arr = arr.sort((a, b) => a < b ? 1 : a > b ? -1 : 0);
	const arrSliced = arr.slice(0, n);
	return arrSliced;
}

/*
 * Takes a number/dice roll and returns a modifier string of format '+/-{Number}'
 * @param	{String}	Modifier string
 * @return	{String}
 */
function getMod(mod) {
	
	// Verify modifier is of format '+/-{Number}d{Number}' or '+/-{Number}'
	const re1 = new RegExp("^(\\+|-)[0-9]+d[0-9]+");
	const re2 = new RegExp("^(\\+|-)[0-9]+");
	if (mod.search(re1) != -1) {
		// If modifier is a dice roll, parse string and get roll
		var op = mod[0];
		var dice = mod.substring(1);
		mod = op + getRolls(dice);
		return mod;
	}
	else if (mod.search(re2) != -1)
		return mod;
	else
		throw error;
}

/**
 * Applies a modifier to the sum of an array, returns result as a readable string
 * @param	{Array}		arr	An array of numbers
 * @param	{String}	mod	A modifier (+/-10, +/-2, etc.) to be applied to the sum
 * @return	{String}
 */
function getResult(arr, mod) {

	var sum = arr.reduce((pv, cv) => pv + cv, 0);

	if (mod != null) {
		var modNum = parseInt(mod.substring(1));
		sum = applyOperator(mod[0], sum, modNum);
	}

	// Construct reply string
	var result = ``;
	for (let i = 0; i < arr.length; i++) {
		if (i == arr.length-1 && mod != null)
			result += `(${arr[i]}) ${mod[0]} ${modNum} = ${sum}`;
		else if (i ==arr.length-1)
			result += `(${arr[i]}) = ${sum}`;
		else
			result += `(${arr[i]}) + `;
	}

	return result;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`roll`)
		.setDescription(`Dice roller. See /help for all available options.`)
		.addStringOption(option => option
			.setName(`dice`)
			.setDescription(`Quantity of dice and number of sides for each die. (ex: 1d20, 4d6, etc.)`)
			.setRequired(true))
		.addStringOption(option => option
			.setName(`modifier`)
			.setDescription(`Add or subtract from the roll total. (ex: +10, -6, etc. | +1d4, -2d6, etc.)`)
			.setRequired(false))
		.addIntegerOption(option => option
			.setName(`keep`)
			.setDescription(`Keeps the X highest rolls.`)
			.setRequired(false)),
	async execute(interaction) {

		const dice = interaction.options.getString(`dice`);
		var mod = interaction.options.getString(`modifier`);
		const keep = interaction.options.getInteger(`keep`);

		const error = `Command syntax incorrect. See /help for available options.`;

		try {
			var rolls = getRolls(dice);
		} catch (e) {
			return interaction.reply(error);
		}

		// If 'keep' is not null, shorten array to 'n' highest numbers
		if (keep != null) {
			try {
				rolls = getHighest(rolls, keep);
			} catch (e) {
				return interaction.reply(error);
			}
		}
		
		// If 'mod' is not null, convert string to modifier
		if (mod != null) {
			try {
				mod = getMod(mod);
			} catch (e) {
				return interaction.reply(error);
			}
		}

		const result = getResult(rolls, mod);
		return interaction.reply(result);
	},
};
