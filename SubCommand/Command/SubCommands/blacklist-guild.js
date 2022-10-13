const BlackListGuild = require("../../../Schemas/BlackListGuild");
const { CommandInteraction, Client } = require("discord.js");
module.exports = {
  subCommand: "blacklist.guild",
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const { user, options } = interaction;
    const ID = options.getString("guild-id");
    const reason = options.getString("reason") || "None Reason Provided.";
    if (isNaN(ID))
      return interaction.editReply({
        content: `ID is supposed to be a number`,
      });
    const Guild = client.guilds.cache.get(ID);
    let GName;
    let GID;
    if (Guild) {
      GName = Guild.name;
      GID = Guild.id;
    } else {
      GName = "Unknown";
      GID = ID;
    }
    let Data = await BlackListGuild.findOne({ Guild: GID }).catch((err) => {});
    if (!Data) {
      Data = new BlackListGuild({
        Guild: GID,
        Reason: reason,
        Time: Date.now(),
      });
      await Data.save();
      interaction.editReply({
        content: `Successfully added **${GName} || ${GID}** in blacklisted server , for the Reason: ${reason}`,
      });
    } else {
        await Data.delete()
        interaction.editReply({
            content: `Successfully removed **${GName} || ${GID}** from blacklisted server`,
          });
    }
  },
};
