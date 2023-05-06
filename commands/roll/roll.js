const { SlashCommandBuilder } = require(`discord.js`);

function getRandInt(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

// Performs a series of dice rolls without modifiers
function getRoll(dice) {

	// Parse argument string to obtain dice-rolling info
	const re = new RegExp("[0-9]+d[0-9]+");
	var parsedDie;	// Store dieQuant and dieSides as strings after parsing
	var dieQuant;	// Quantity of dice being rolled
	var dieSides;	// Number of sides for each die rolled
	if (dice.search(re) != -1) {
		parsedDie = dice.split(`d`);
		dieQuant = parsedDie[0];
		dieSides = parsedDie[1];
	} else {
		return `Command syntax incorrect. See /help for available /roll options.`;
	}

	// Roll dice, track running total, append rolls to `rollHistory`
	var rollHistory = ``;	// All dice rolls appended to this string
	var sum = 0;		// Running total of all dice rolls
	for (let i = 0; i < dieQuant; i++) {
		currentRoll = getRandInt(1, dieSides);
		sum += currentRoll;
		if (i == dieQuant-1)
			rollHistory = rollHistory.concat(`(${currentRoll}) = ${sum}`);
		else
			rollHistory = rollHistory.concat(`(${currentRoll}) + `);
	}

	return rollHistory;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`roll`)
		.setDescription(`Dice roller. Type /help to view all /roll options.`)
		.addStringOption(option =>
			option
				.setName(`dice`)
				.setDescription(`The number of sides and quantity of dice being rolled. (ex: 1d20, 3d6, etc.)`)
				.setRequired(true)),
	async execute(interaction) {
		const dice = interaction.options.getString('dice');
		const result = getRoll(dice);
		return interaction.reply(result);
	},
};
