const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("BlackList Command")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Blacklist a user")
        .addStringOption((options) =>
          options
            .setName("user-id")
            .setDescription("input user's id")
            .setRequired(true)
        )
        .addStringOption((options) =>
        options
          .setName("reason")
          .setDescription("reason to blacklist user")
      )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("guild")
        .setDescription("Blacklist a guild")
        .addStringOption((options) =>
          options
            .setName("guild-id")
            .setDescription("input guilds's id")
            .setRequired(true)
        )
        .addStringOption((options) =>
        options
          .setName("reason")
          .setDescription("reason to blacklist guild")
      )
    ),
};
