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
    const {  options } = interaction;
    const choices = options.getString("options");
    const ID = options.getString("id");
    const reason = options.getString("reason") || "None Reason Provided.";
    if (isNaN(ID))
      return interaction.editReply({content: `ID is supposed to be a number`,});
    switch (choices) {
      case "guild":{    
       const Guild = await client.guilds.fetch(ID);
        let Data = await BlackListGuild.findOne({ Guild: Guild.id }).catch((err) => { });
        if (!Data) {
          Data = new BlackListGuild({ Guild: Guild.id, Reason: reason, Time: Date.now() });
          await Data.save();
          interaction.editReply({
            content: `Successfully added **${Guild.name} || ${Guild.id}** in blacklisted server , for the Reason: ${reason}`,});
        } else {
          await Data.delete()
          interaction.editReply({
            content: `Successfully removed **${Guild.name} || ${Guild.id}** from blacklisted server`});
      
        }
      }
        break;
      case "user":{
        const User = await client.users.fetch(ID);
        let Data = await BlackListUser.findOne({ User: User.id }).catch((err) => { });
        if (!Data) {
          Data = new BlackListUser({ User: User.id, Reason: reason, Time: Date.now() });
          await Data.save();
          interaction.editReply({
            content: `Successfully added **${User} | ${User.id} | ${User.username}** in blacklisted users , for the Reason: ${reason}`});
        } else {
          await Data.delete()
          interaction.editReply({
            content: `Successfully removed **${User} | ${User.id} | ${User.username}** from blacklisted server`});
        }
      }
        break;
    }
  },
};
