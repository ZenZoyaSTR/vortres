const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pruge')
    .setDescription('Delete the last X amount of messages')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Amount of messages to delete')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger('amount');

    if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.channel.bulkDelete(amount, true).catch(err => {
        console.error('\n\nAn error has occured:\n', err, '\n\n');
        let cmdError = {
          description: `There was an error while executing this command!\n\n**Error:**\n\`\`\`${err}\`\`\``,
          color: client.color.red,
        }
        return interaction.reply({ embeds: [cmdError], ephemeral: true });
      });
      let cmdSuc = {
        description: `Successfully purge \`${amount}\` messages.`,
        color: client.color.blue,
      }
      return interaction.reply({ embeds: [cmdSuc] });
    } else {
      let cmdSuc = {
        description: `You need to have permission \`MANAGE_MESSAGES\` to use this command.`,
        color: client.color.yellow,
      }
      return interaction.reply({ embeds: [cmdSuc] });
    }
  }
};
