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
      return interaction.editReply({
        content: `ID is supposed to be a number`,
      });
    let Member;
    let MName;
    let MID;
    const User = client.users.cache.get(ID);
    if (User) {
      Member = User;
      MName = User.tag;
      MID = User.id;
    } else {
      Member = "Unknown User #0000";
      MName = "Unknow User #0000";
      MID = ID;
    }
    let Data = await BlackListUser.findOne({ User: MID }).catch((err) => {
      console.log(err);
    });
    if (!Data) {
      Data = new BlackListUser({
        User: MID,
        Reason: reason,
        Time: Date.now(),
      });
      await Data.save();
      interaction.editReply({
        content: `Successfully added **${Member} | ${MName} | ${MID}** in blacklisted user , for the Reason: ${reason}`,
      });
    } else {
      await Data.delete();
      interaction.editReply({
        content: `Successfully removed **${Member} | ${MName} | ${MID}** fom blacklisted user `,
      });
    }
  },
};
