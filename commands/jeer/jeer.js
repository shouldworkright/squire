const { SlashCommandBuilder } = require("discord.js");

const jeers = [
	"Your face could turn a basilisk to stone.",
	"If laughter is the best medicine, your face could cast Revivify.",
	"You're proof that even gods can make mistakes.",
	"Some babies get dropped on their heads. Someone must have thrown you against a wall.",
	"Typically I need to pay to see a freak show like you.",
	"If stupidity were a crime, you should be sentenced to death.",
	"I'm not sure whether I should cast Charm Person, or Hold Monster...",
	"...was your father a necromancer, by chance?",
	"You're ugly enough to make pacts with warlocks."
]

function getRandInt(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("jeer")
		.setDescription("Returns a message disparagement."),
	async execute(interaction) {
		const result = jeers[getRandInt(0, jeers.length-1)];
		return interaction.reply(result);
	},
};
