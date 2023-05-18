const { SlashCommandBuilder } = require(`discord.js`);

function getRandNum(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

/**
 * Returns the sum/difference of two numbers based on the provided operator
 * @param	{String}	op	Operator to be applied (+/-)
 * @param	{Number}	x	First number
 * @param	{Number}	y	Second number
 * @returns	{Number}
 */
function applyOperator(op, x, y) {
	const supportedOperators = {
		"+": (x, y) => x + y,
		"-": (x, y) => x - y
	};
	if (op in supportedOperators)
		return supportedOperators[op](x, y);
}

/**
 * Returns an array of randomly generated integers
 * @param	{String}	dice	Specifies the quantity of dice, and the number of sides each die has
 * @returns	{Object}		An array of positive integers
 */
function getRolls(dice) {
	// Parse 'dice' string to get die-rolling information
	var re = new RegExp("[0-9]+d[0-9]+");
	if (dice.search(re) != -1) {
		var parsed = dice.split(`d`);
		var quant = parsed[0];	// Quantity of dice being rolled
		var sides = parsed[1];	// Number of sides for each die
	}
	else if (isNaN(dice))
		throw error;
	
	// Generate random integer array
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
 * @returns	{Array}
 */
function getHighest(arr, n) {
	// Sort array in descending order, preserve the top 'n' numbers
	var arr = arr.sort((a, b) => a < b ? 1 : a > b ? -1 : 0);
	const arrSliced = arr.slice(0, n);
	return arrSliced;
}

/**
 * Takes a raw modifier string and returns a normalized dice roll modifier
 * @param	{String}	mod	The raw modifier string (either a +/- integer or a +/- dice roll)
 * @returns	{String}		The normalized dice roll modifier string (a +/- integer)
 */
function getMod(mod) {
	// Check if modifier string is formatted correctly '+/-{Number}d{Number}' or '+/-{Number}'
	const re1 = new RegExp("^(\\+|-)[0-9]+d[0-9]+");
	const re2 = new RegExp("^(\\+|-)[0-9]+");
	if (mod.search(re1) != -1) {
		// If modifier is a dice roll, parse string and roll die
		var op = mod[0];
		var dice = mod.substring(1);
		mod = op + getRolls(dice);
		return mod;
	}
	else if (mod.search(re2) != -1)
		// If modifier is a +/- integer, return the modifier
		return mod;
	else
		throw error;
}

/**
 * Returns a string containing a series of dice rolls, and their sum
 * @param	{Object}	arr	An array of dice rolls (positive integers)
 * @param	{String}	mod	A modifier (+/-10, +/-2, etc.) to be applied to the roll sum
 * @returns	{String}		A series of dice rolls and all applied modifiers
 */
function getResult(arr, mod) {
	// Get sum of all dice rolls
	var sum = arr.reduce((pv, cv) => pv + cv, 0);

	// If a modifier has been passed, parse raw modifier string and apply to roll sum
	if (mod != null) {
		var modNum = parseInt(mod.substring(1));
		sum = applyOperator(mod[0], sum, modNum);
	}

	// Construct return string
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
		// Get required/optional command input
		const dice = interaction.options.getString(`dice`);
		var mod = interaction.options.getString(`modifier`);
		const keep = interaction.options.getInteger(`keep`);

		// Roll dice, throw error if dice syntax is incorrect
		const error = `Command syntax is incorrect. See /help for available options.`;
		try {
			var rolls = getRolls(dice);
		} catch (e) {
			return interaction.reply(error);
		}

		// If 'keep' option is used, shorten dice roll array to 'n' highest rolls
		if (keep != null) {
			try {
				rolls = getHighest(rolls, keep);
			} catch (e) {
				return interaction.reply(error);
			}
		}
		
		// If 'mod' option is used, convert raw input string to a dice roll modifier
		if (mod != null) {
			try {
				mod = getMod(mod);
			} catch (e) {
				return interaction.reply(error);
			}
		}

		// Reply with final dice roll
		const result = getResult(rolls, mod);
		return interaction.reply(result);
	},
};
