const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { PROVIDERS_LIST } = require("@consumet/extensions");
const { capitalizeFirstLetter } = require("@consumet/extensions/dist/utils");

module.exports = {
        data: new SlashCommandBuilder()
            .setName("search")
            .setDescription("Search for a movie/tvshow/anime, etc...")
            .addStringOption((option) =>
                option
                .setName("query")
                .setDescription("Query to search")
                .setRequired(true)
            )
            .addStringOption((option) =>
                option
                .setName("provider")
                .setDescription("Provider to search (default: Anilist)")
                .setRequired(false)
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
            )
            .addStringOption((option) =>
                option
                .setName("list")
                .setDescription("set to true to get a list of results")
                .setRequired(false)
                .addChoices({ name: "True", value: "true" }, { name: "False", value: "false" })
            ),

        async execute(interaction) {
            let category = undefined;
            if (interaction.options.getString("provider")) {
                category = interaction.options.getString("provider").split(".")[0];
            } else category = "META";

            const provider = PROVIDERS_LIST[category].find(
                (p) =>
                p.toString.classPath ===
                (interaction.options.getString("provider") ?
                    interaction.options.getString("provider") :
                    "META.Anilist")
            );
            const query = interaction.options.getString("query");

            let res = undefined;
            try {
                res = await provider.search(query);
            } catch (e) {
                await interaction.reply({
                    content: `An error occured while searching for \`${query}\` on \`${provider.toString.name}\``,
                    ephemeral: true,
                });
            }

            const isList = interaction.options.getString("list") === "true";
            if (isList) {
                res = res.results.slice(0, 4);
            } else res = [res.results[0]];

            const embeds = [
                    ...res.map((r) =>
                        new EmbedBuilder()
                        .setTitle(
                            `${
              typeof r.title !== "string"
                ? r.title.english
                  ? r.title.english
                  : r.title.romaji
                : r.title
            } ${r.type ? `(${r.type})` : ""}`
          )
          .setURL(`${r.url ? r.url : `https://anilist.co/anime/${r.id}`}`)
          .setColor(r.color ? r.color : 0x000000)
          .setDescription(
            !isList
              ? r.description
                ? r.description.replace(/<[^>]*>?/gm, "")
                : "No description available"
              : null
          )
          .addFields(
            [
              r.rating
                ? {
                    name: "rating",
                    value: `${
                      r.rating
                        ? `${
                            provider.toString.name === "Anilist"
                              ? parseFloat(r.rating / 10)
                              : r.rating
                          }/10`
                        : "N/A"
                    }`,
                    inline: true,
                  }
                : null,
              r.type
                ? { name: "Format", value: `${r.type}`, inline: true }
                : null,
              r.status
                ? {
                    name: "Status",
                    value: `${capitalizeFirstLetter(r.status.toLowerCase())}`,
                    inline: true,
                  }
                : null,
              r.releaseDate
                ? {
                    name: "Release Date",
                    value: `${r.releaseDate ? r.releaseDate : "N/A"}`,
                    inline: true,
                  }
                : null,
            ].filter((f) => f)
          )
          .setThumbnail(r.image.includes("http") ? r.image : null)
          .setTimestamp(!isList ? undefined : null)
          .setFooter(
            !isList
              ? {
                  text: `Requested by ${interaction.user.username} | Provided by ${provider.toString.name}`,
                  iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`,
                }
              : null
          )
      ),
    ];

    await interaction.reply({ embeds: embeds });
  },
};