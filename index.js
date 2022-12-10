
// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID 
const TOKEN = process.env.TOKEN 
const PUBLIC_KEY = process.env.PUBLIC_KEY || "eefd7bc6ab3f3be01ad49cc2477acacb43756cef30bff95c40dd43f81b0b1d60"
const GUILD_ID = process.env.GUILD_ID 


const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
const { messageLink } = require('discord.js')


const app = express();
// app.use(bodyParser.json());

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

  
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name)

    if (interaction.data.name === 'pingvoicechannel') {
      // Check if the interaction.member object has a voice property
      if (interaction.member.voice) {
        // Check if the voice property has a channel property
        if (interaction.member.voice.channel) {
          // Get the voice channel that the message sender is in
          const voiceChannel = interaction.member.voice.channel;
    
          // Get all the members of the voice channel
          const members = voiceChannel.members;
    
          // Send a message to each member of the voice channel
          members.forEach(async member => {
            try {
              // https://discord.com/developers/docs/resources/channel#create-message
              await discord_api.post(`/channels/${member.user.id}/messages`, {
                content: `You were pinged by ${interaction.member.user.username} in the ${voiceChannel.name} voice channel!`,
              });
            } catch (e) {
              console.log(e);
            }
          });
        } else {
          // Return an error message if the voice property does not have a channel property
          return res.send('You need to be in a voice channel to use this command!');
        }
      } else {
        // Return an error message if the interaction.member object does not have a voice property
        return res.send('You need to be in a voice channel to use this command!');
      }
    }

    if(interaction.data.name == 'yo'){
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Yo ${interaction.member.user.username}!`,
        },
      });
    }

    if(interaction.data.name == 'dm'){
      // https://discord.com/developers/docs/resources/user#create-dm
      let c = (await discord_api.post(`/users/@me/channels`,{
        recipient_id: interaction.member.user.id
      })).data
      try{
        // https://discord.com/developers/docs/resources/channel#create-message
        let res = await discord_api.post(`/channels/${c.id}/messages`,{
          content:'Yo! I got your slash command. I am not able to respond to DMs just slash commands.',
        })
        console.log(res.data)
      }catch(e){
        console.log(e)
      }

     
         
      }

      return res.send({
        // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
          content:'👍'
        }
      });
    }

});



app.get('/register_commands', async (req,res) =>{
  let slash_commands = [
    {
      "name": "yo",
      "description": "replies with Yo!",
      "options": []
    },
    {
      "name": "dm",
      "description": "sends user a DM",
      "options": []
    },
    {
      "name":"pingvoicechannel",
      "description":"ping all users in the voice channel",
      "options": []

    }
  ]
  try
  {
    // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    let discord_response = await discord_api.put(
      `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
      slash_commands
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

