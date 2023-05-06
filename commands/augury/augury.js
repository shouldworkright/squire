const { SlashCommandBuilder } = require(`discord.js`);

const augury = [
	"(Weal) The caress of a gentle wind fills you with reassurance. The path forward becomes clear.",
	"(Woe) A sudden tightness in your chest makes it hard to breathe. Fear seeps into you like rain into cracked stone.",
	"(Weal and Woe) Your right hand feels warm, but your left becomes numb. Something will be given, something will be taken. Plan accordingly.",
	"(Nothing) Nothing happens. The heavens seem indifferent to your circumstances."
]

function getRandInt(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`augury`)
		.setDescription(`Returns 'Weal/Woe' for good/bad results, or 'Nothing' for neutral results.`),
	async execute(interaction) {
		const result = augury[getRandInt(0, 3)];
		return interaction.reply(result);
	},
};
