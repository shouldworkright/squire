const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`help`)
		.setDescription(`Returns a list of basic commands.`),
	async execute(interaction) {

		// This is the first page that appears when a user enters /help
		const embedIndex = new EmbedBuilder()
			.setColor(`Blue`)
			.setTitle(`Help Menu`)
			.setDescription(`Use the buttons at the bottom to switch between pages.`)
			.addFields({ name: `General`, value: `A list of general commands.` })
			.addFields({ name: `Spells & Actions`, value: `A list of commands related to spells and other actions.` })
			.addFields({ name: `Other`, value: `A list of commands that aren't particularly useful.` })
		
		// The page for all general commands
		const embedGeneral = new EmbedBuilder()
			.setColor(`Green`)
			.setTitle(`General Commands`)
			.setDescription(`Various TTRPG tools and utilities.`)
			.addFields(
				{ name: `/help`, value: `Displays the help menu.` },
				{ name: `/roll`, value: `A dice roller that displays the outcome of all individual dice rolls and their sum. To use, enter the number of dice and the number of sides for each die rolled. (ex: <# of dice>d<# of sides> => 1d20, 4d6, 8d10, etc.)` },
				{ name: `(optional) modifier`, value: `Adds or subtracts from the sum. To use, enter the modifier as a dice roll or whole number. (ex: +10, -3, +1d6, -1d4, etc.)`, inline: true },
				{ name: `(optional) keep`, value: `When rolling multiple dice, keeps the X highest rolls. To use, enter the number of rolls you want kept. (ex: 1, 5, 12, etc.)`, inline: true },
				{ name: `/cgen`, value: `Generates a random D&D 5e character. Includes the character's name, alignment, race, class, ability scores, and a brief backstory.` },
			)

		// The page for all spell/action commands
		const embedSpells = new EmbedBuilder()
			.setColor(`Yellow`)
			.setTitle(`Spells and Actions`)
			.setDescription(`Commands related to D&D 5e spells and other actions.`)
			.addFields(
				{ name: `/augury`, value: `Returns 'Weal' for good results, 'Woe' for bad results, 'Weal and Woe' for both good and bad results, or 'Nothing' for results that are neither good nor bad.` },
			)

		// The page for all misc. commands
		const embedOther = new EmbedBuilder()
			.setColor(`Purple`)
			.setTitle(`Other Commands`)
			.setDescription(`Useless stuff and other rubbish.`)
			.addFields(
				{ name: `/cheer`, value: `Returns a randomly selected message of encouragement.` },
				{ name: `/jeer`, value: `Returns a randomly selected insult.` },
				{ name: `/knave`, value: `Express righteous indignation!` },
			)

		// Footer buttons that allows user to switch between pages
		const button  = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
				.setCustomId(`general`)
				.setLabel(`General`)
				.setStyle(ButtonStyle.Success),

				new ButtonBuilder()
				.setCustomId(`spells`)
				.setLabel(`Spells & Actions`)
				.setStyle(ButtonStyle.Success),

				new ButtonBuilder()
				.setCustomId(`other`)
				.setLabel(`Other`)
				.setStyle(ButtonStyle.Success),

				new ButtonBuilder()
				.setLabel(`GitHub`)
				.setURL(`https://github.com/shouldworkright/squire`)
				.setStyle(ButtonStyle.Link),
			)

		const message = await interaction.reply({ embeds: [embedIndex], components: [button] });
		const collector = await message.createMessageComponentCollector();

		collector.on(`collect`, async i => {

			// Serve 'General' page when user clicks associated button
			if (i.customId === `general`) {
				if (i.user.id !== interaction.user.id)
					return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons.`, ephemeral: true })
				await i.update ({ embeds: [embedGeneral], components: [button] })
			}

			// Serve 'Spells & Actions' page when user clicks associated button
			if (i.customId === `spells`) {
				if (i.user.id !== interaction.user.id)
					return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons.`, ephemeral: true })
				await i.update ({ embeds: [embedSpells], components: [button] })
			}

			// Serve `Other Commands` page when user clicks associated button
			if (i.customId === `other`) {
				if (i.user.id !== interaction.user.id)
					return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons.`, ephemeral: true })
				await i.update ({ embeds: [embedOther], components: [button] })
			}
		})
	},
}
