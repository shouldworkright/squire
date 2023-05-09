const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("knave")
		.setDescription("Used to express righteous indignation."),
	async execute(interaction) {
		// TODO: Find a better way of doing this
		var result = `What in the name of God didst thou claim of me, thou miserable wretch? I must inform thee that I am a knight of unsurpassed valor and I have many a time participated in raids against the Viking rebels and have assuredly slain thirtyscore of them. I have trained in the art of simian warfare and none can challenge my skills of archery. Thou art nought in my eyes but another target. I shall exterminate thee with such accuracy that has never before been seen upon this mortal plane, hear me now. Didst thou truly believe thou couldst slander me so upon the tapestry? Reconsider your position, fool. As I write this, I am in the process of contacting my network of assassins across the land of England and they are tracking your movements at this instant, so thou would be wise to prepare thyself for the coming storm. The storm that destroys the unfortunate object you refer to as your life. Thou art assuredly deceased, knave. I can appear at any location and at any time, and can end thy life in seventyscore ways, and that be only when using my bare hands. But I am not solely skilled in fisticuffs; I also posess access to the entirety of Duke William's armory and I will make full use of it when banishing your body from the entirety of the earth. Thou scoundrel, perhaps hadst thou known what apocalyptic vengeance thy "clever" jests were to bring upon thee thou wouldst have held thy tongue. But thou couldst not, nor did not, and now thou art paying the due price of thy actions, fool. I shall defecate fury upon thee and thou shall flounder within it. Thou art truly smote, knave.`
		return interaction.reply(result);
	},
};
