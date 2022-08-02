const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PROVIDERS_LIST } = require('@consumet/extensions');
const { capitalizeFirstLetter } = require('@consumet/extensions/dist/utils');

module.exports = {
    data: new SlashCommandBuilder().setName('stats').setDescription('Current stats of consumet api'),
    async execute(interaction) {
        let providersJson = [{}];

        for (const { provider, i }
            of Object.keys(PROVIDERS_LIST).map((provider, i) => ({ i, provider }))) {
            providersJson.push({
                [provider]: PROVIDERS_LIST[provider].map((p) => p.toString),
            });

            providersJson[i + 1][provider].sort((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1));
        }

        providersJson.shift();
        providersJson = providersJson.map((provider) => ({
            name: capitalizeFirstLetter(Object.keys(provider)[0].replace(/_/g, ' ').toLocaleLowerCase()),
            value: provider[Object.keys(provider)[0]].map((p) => p.name).join(', '),
            inline: true,
        }));
        providersJson.pop();

        const embed = new EmbedBuilder()
            .setTitle('Consumet API Stats')
            .setColor(0x000000)
            .setDescription(
                `Currently there are ${[].concat.apply([], Object.values(PROVIDERS_LIST)).length} supported providers.`
            )
            .addFields(...providersJson);

        interaction.reply({ embeds: [embed] });
    },
};