const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const BlackListGuild = require("../../Schemas/BlackListGuild");
const BlackListUser = require("../../Schemas/BlackListUser");
 


module.exports = {
    name: "interactionCreate",
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const GuildData = await BlackListGuild.findOne({Guild: interaction.guild.id}).catch((err) => {});
        const UserData = await BlackListUser.findOne({User: interaction.user.id}).catch((err) => {});
        const Embed = new EmbedBuilder()
        .setColor("Random")
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setTimestamp()

        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.reply({
                content: `This Command is Outdated.`,
                ephemeral: true,
            });

        if (command.developer && interaction.user.id !== "744862701720830002")
            return interaction.reply({
                content: `This Command Is only for developers`,
                ephemeral: true,
            });
            if (GuildData)
            return interaction.reply({
              embeds: [
                Embed.setTitle(`Server Blacklisted`)
                     .setDescription(`Your server has been blacklisted from using this bot on <t:${parseInt(GuildData.Time / 1000)}:R>, for the reason: **${GuildData.Reason}**`)]});
          if (UserData)
            return interaction.reply({embeds: [
                Embed.setTitle(`User Blacklisted`)
                     .setDescription(`You have been blacklisted from using this bot on <t:${parseInt(UserData.Time / 1000)}:R>, for the reason: **${UserData.Reason}**`)]});
        command.execute(interaction, client);
    },
};
