// Import
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');

// Env
const { BOT_TOKEN, CLIENT_ID } = process.env;

// GatewayIntentBits
const client = new Client({
     intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
     ]
});

// Handler
client.color = require('./util/colorHelper');

(async () => {
     console.clear();
     console.info("Starite |> Starting...");

     // Registering Slash commands
     const commands = [];
     const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

     for (const file of commandFiles) {
          const command = require(`../src/commands/${file}`);
          commands.push(command.data.toJSON());
     }

     const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

     try {
          console.info(`Starite |> Started refreshing ${commands.length} application (/) commands`);

          const data = await rest.put(
               Routes.applicationGuildCommands(CLIENT_ID, "1059087765788180541"),
               { body: commands },
          );

          console.info(`Starite |> Successfully reloaded ${data.length} application (/) commands`);
     } catch (error) {
          console.error(error);
     }


     // Commands Handler
     client.commands = new Collection();
     const commandsPath = path.join(__dirname, 'commands');
     const commandFiles2 = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

     for (const file of commandFiles2) {
          const filePath = path.join(commandsPath, file);
          const command = require(filePath);
          client.commands.set(command.data.name, command);
     }

     client.on(Events.InteractionCreate, async interaction => {
          if (!interaction.isChatInputCommand()) return;

          const command = client.commands.get(interaction.commandName);

          if (!command) return;

          try {
               await command.execute(interaction, client);
          } catch (err) {
               console.error('\n\nAn error has occured:\n', err);
               let slashError = {
                    description: `There was an error while executing this command!\n\n**Error:**\n\`\`\`${err}\`\`\``,
                    color: client.color.fail,
               }
               await interaction.reply({ embeds: [slashError], ephemeral: true });
          }
     });

     // Logging bot in
     console.info('Starite |> Authenticating with Discord');
     await client.login(BOT_TOKEN);
     console.info(`Starite |> Logged-in as ${client.user.tag}`);
     console.info('Starite |> Completed Discord authentication');
})();