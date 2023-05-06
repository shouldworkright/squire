const { SlashCommandBuilder } = require(`discord.js`);

const cheers = [
	"Even the gods shall be awestruck by your might!",
	"One day, your grandchildren shall tell the tale of this moment!",
	"The heart of a tarrasque beats within you!",
	"There is no sweeter music than the screams of our enemies!",
	"Your blade sings! Wasn't a very good song, but it got stuck in the head of some people!"
]

function getRandInt(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`cheer`)
		.setDescription(`Returns a message of encouragement.`),
	async execute(interaction) {
		const result = cheers[getRandInt(0, cheers.length-1)];
		return interaction.reply(result);
	},
};
