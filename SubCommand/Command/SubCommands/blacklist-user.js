const BlackListUser = require("../../../Schemas/BlackListUser");
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  subCommand: "blacklist.user",
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const { user, options } = interaction;
    const ID = options.getString("user-id");
    const reason = options.getString("reason") || "None Reason Provided.";
    if (isNaN(ID))
      return interaction.editReply({ content: `ID is supposed to be a number` });
    const User = await client.users.fetch(ID);
    let Data = await BlackListUser.findOne({ User: User.id }).catch((err) => { });
    if (!Data) {
      Data = new BlackListUser({ User: User.id, Reason: reason, Time: Date.now() });
      await Data.save();
      interaction.editReply({
        content: `Successfully added **${User} | ${User.id} | ${User.username}** in blacklisted users , for the Reason: ${reason}`
      });
    } else {
      await Data.delete()
      interaction.editReply({
        content: `Successfully removed **${User} | ${User.id} | ${User.username}** from blacklisted server`
      });

    }

  },
};