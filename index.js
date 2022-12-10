
// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID 
const TOKEN = process.env.TOKEN 
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID 


const fs = require('node:fs');
const path = require('node:path');
const { Client: DiscordClient } = require('discord.js');
const { SlashCommandBuilder, Collection, GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');


const app = express();
// app.use(bodyParser.json());

const client = new DiscordClient({ intents: [GatewayIntentBits.Guilds] });

const discord_api = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	"Access-Control-Allow-Headers": "Authorization",
	"Authorization": `Bot ${TOKEN}`
  }
});




app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;
  const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}



  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name)
    if(interaction.data.name == 'yo'){
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Yo ${interaction.member.user.username}!`,
        },
      });
    }

    // if(interaction.data.name == 'dm'){
    //   // https://discord.com/developers/docs/resources/user#create-dm
    //   let c = (await discord_api.post(`/users/@me/channels`,{
    //     recipient_id: interaction.member.user.id
    //   })).data
    //   try{
    //     // https://discord.com/developers/docs/resources/channel#create-message
    //     let res = await discord_api.post(`/channels/${c.id}/messages`,{
    //       content:'Yo! I got your slash command. I am not able to respond to DMs just slash commands.',
    //     })
    //     console.log(res.data)
    //   }catch(e){
    //     console.log(e)
    //   }

      return res.send({
        // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
          content:'👍'
        }
      });
    }
  

});



app.get('/register_commands', async (req, res) =>{

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}
try{
let discord_response = await discord_api.put(
  `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
  commands
  )    
  console.log(discord_response.data)
  return res.send('commands have been registered')
}catch(e){
  console.error(e.code)
  console.error(e.response?.data)
  return res.send(`${e.code} error from discord`)
}

})


app.get('/', async (req,res) =>{
  return res.send('Follow documentation ')
})


app.listen(8999, () => {

})

