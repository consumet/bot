const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PROVIDERS_LIST } = require('@consumet/extensions');
const { capitalizeFirstLetter } = require('@consumet/extensions/dist/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('provider')
        .setDescription('Get information about a provider')
        .addStringOption((option) =>
            option
            .setName('name')
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
        const category = interaction.options.getString('name').split('.')[0];
        const provider = PROVIDERS_LIST[category].find(
            (p) => p.toString.classPath === interaction.options.getString('name')
        );

        const embed = new EmbedBuilder()
            .setTitle(provider.toString.name)
            .setColor(0x000000)
            .setDescription(
                `For library usage, please refer to [this](https://github.com/consumet/consumet.ts/blob/master/docs/providers/${provider.toString.name.toLowerCase()}.md) page. For API usage, please refer to [this](https://docs.consumet.org/#tag/${provider.toString.name.toLowerCase()}) page.`
            )
            .addFields([{
                    name: 'Category',
                    value: capitalizeFirstLetter(
                        provider.toString.classPath.split('.')[0].replace(/_/g, ' ').toLocaleLowerCase()
                    ),
                    inline: true,
                },
                {
                    name: 'Availability',
                    value: provider.toString.isWorking ? 'Available' : 'Unavailable',
                    inline: true,
                },
                {
                    name: 'Languages',
                    value: typeof provider.toString.lang === 'object' ? provider.toString.lang.join(', ') : provider.toString.lang,
                    inline: true,
                },
                { name: 'ClassPath', value: provider.toString.classPath, inline: true },
            ])
            .setThumbnail(provider.toString.logo);

        await interaction.reply({ embeds: [embed] });
    },
};