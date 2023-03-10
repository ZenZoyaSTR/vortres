const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get the Bot connection speed'),
  async execute(interaction, client) {
    let embed = {
      title: 'Bot Latency',
      description: `🏓 Latency: \`${Math.round(client.ws.ping)} ms\``,
      color: client.color.yellow,
    }
    interaction.reply({ embeds: [embed] });
  },
};
