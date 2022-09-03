const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PROVIDERS_LIST } = require('@consumet/extensions');
const { capitalizeFirstLetter } = require('@consumet/extensions/dist/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for a movie/tvshow/anime, etc...')
        .addStringOption((option) =>
            option
            .setName('provider')
            .setDescription('Provider to search')
            .setRequired(true)
            .addChoices(
                ...Object.keys(PROVIDERS_LIST)
                .map((c) =>
                    PROVIDERS_LIST[c].map((p) => ({
                        name: capitalizeFirstLetter(p.name),
                        value: p.toString.classPath,
                    }))
                )
                .flat()
                .sort((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1))
            )
        ),
    async execute(interaction) {
        const category = interaction.options.getString('provider').split('.')[0];
        const provider = PROVIDERS_LIST[category].find(
            (p) => p.toString.classPath === interaction.options.getString('provider')
        );

        await interaction.reply('PONG!');
    },
};