const { SlashCommandBuilder } = require(`discord.js`);
const { request, gql } = require(`graphql-request`);
const { Configuration, OpenAIApi } = require(`openai`);
const { tokenOpenAI } = require(`../../config.json`);

function getRandInt(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

/**
 * Returns a randomly generated character name
 * @async
 * @returns	{String}
 */
async function getName() {
	const configuration = new Configuration({
		apiKey: tokenOpenAI,
	});
	const openai = new OpenAIApi(configuration);
	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: "Return a random Dungeons & Dragons character's full name without any additional text.",
		max_tokens: 64,
		temperature: 0.4,
		top_p: 1,
	});
	const name = response.data.choices[0].text;
	return name;
}

/**
 * Returns a random character alignment, race and class
 * @async
 * @returns	{Object}
 */
async function getDetails() {
	// Get D&D rulebook information from GraphQL API
	const endpoint = `https://www.dnd5eapi.co/graphql`;
	const query = `
		query {
			alignments {
				name
			}
			races {
				name
			}
			classes {
				name
			}
		}
	`;
	let responseData;
	await request(endpoint, query)
		.then(data => { responseData = data })
		.catch(error => console.error(`Error executing query: `, error));

	// Parse response data, select random values for each character detail
	const alignment = responseData[`alignments`][getRandInt(0, responseData[`alignments`].length-1)].name;
	const race = responseData[`races`][getRandInt(0, responseData[`races`].length-1)].name;
	const spec = responseData[`classes`][getRandInt(0, responseData[`classes`].length-1)].name;
	const details = {
		alignment: alignment,
		race: race,
		spec: spec
	};
	return details;
}

/**
 * Returns randomly generated ability scores
 * @returns	{Object}
 */
function getStats() {
	// Rolls are based on 4d6 method (roll 4d6, drop the lowest roll)
	const stats = {
		"STR": getRandInt(3, 18),
		"DEX": getRandInt(3, 18),
		"CON": getRandInt(3, 18),
		"INT": getRandInt(3, 18),
		"WIS": getRandInt(3, 18),
		"CHA": getRandInt(3, 18)
	};
	return stats;
}

/**
 * Returns a randomly generated character backstory
 * @async
 * @param	{String}	name		A character's name
 * @param	{Object}	details		A character's alignmnet, race, and class
 * @returns	{String}
 */
async function getStory(name, details) {
	const configuration = new Configuration({
		apiKey: tokenOpenAI,
	});
	const openai = new OpenAIApi(configuration);
	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: 
		`Write a paragraph of backstory for a Dungeons and Dragons character who's a ${details.alignment} ${details.race} ${details.spec} named ${name}.`,
		max_tokens: 2048,
		temperature: 0.4,
		top_p: 1,
	});
	const story = response.data.choices[0].text.replace(/(\n)/gm,"");
	return story;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`cgen`)
		.setDescription(`Returns a randomly generated D&D 5e character.`),
	async execute(interaction) {
		// If a bot doesn't reply within 3 seconds of receiving a command, the command times out
		// This prevents that from happening
		await interaction.reply({ content: `(Loading) A legendary hero approaches...`, ephemeral: true });
		
		// Generate character information
		const name = await getName();
		const details = await getDetails();
		const story = await getStory(name, details);
		const stats = getStats();

		// Aggregate information, overwrite original message
		const result = `
			${name}, a ${details.alignment} ${details.race} ${details.spec}
			\nSTR - ${stats.STR}\tDEX - ${stats.DEX}\tCON - ${stats.CON}\tINT - ${stats.INT}\tWIS - ${stats.WIS}\tCHA - ${stats.CHA}
			\n${story}
		`;
		await interaction.editReply({ content: result });
	}
};
