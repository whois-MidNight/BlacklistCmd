const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const BlackListGuild = require('../../Schemas/BlackListGuild')
const BlackListUser = require('../../Schemas/BlackListUser')

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("BlackList Command")
    .addStringOption((options) =>
      options
        .setName("options")
        .setDescription(`Are you blacklisting a Guild or a User?`)
        .setRequired(true)
        .addChoices(
          { name: "Guild", value: "guild" },
          { name: "User", value: "user" }
        )
    )
    .addStringOption((options) =>
      options
        .setName("id")
        .setDescription("input user's or guild's id")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options.setName("reason").setDescription("reason to blacklist user")
    ),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const { user, options } = interaction;
    const choices = options.getString("options");
    const ID = options.getString("id");
    const reason = options.getString("reason") || "None Reason Provided.";
    if (isNaN(ID))
      return interaction.editReply({content: `ID is supposed to be a number`,});
    switch (choices) {
      case "guild":{

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
          interaction.editReply({content: `Successfully added **${GName} || ${GID}** in blacklisted server , for the Reason: ${reason}`});
        } else {
            await Data.delete()
            interaction.editReply({content: `Successfully removed **${GName} || ${GID}** from blacklisted server`});
        }
      }
        break;
      case "user":{
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
          interaction.editReply({content: `Successfully added **${Member} | ${MName} | ${MID}** in blacklisted user , for the Reason: ${reason}`});
        } else {
          await Data.delete();interaction.editReply({content: `Successfully removed **${Member} | ${MName} | ${MID}** fom blacklisted user `});
        }
      }
        break;
    }
  },
};
