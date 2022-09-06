const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stream")
        .setDescription("Stream a movie/tvshow/anime, etc...")
        .addStringOption((option) =>
            option
            .setName("query")
            .setDescription("Episode id to stream")
            .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.reply("Pay me $100 and I'll implement it :)");
    },
};