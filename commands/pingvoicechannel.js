const { SlashCommandBuilder } = require('discord.js');

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('pingvoicechannel')
    .setDescription("Ping everyone in the vc you're currently in."),
    async execute(message) {
        const voiceChannel = message.member.voice.channel;
  
        if (!voiceChannel) {
          // The message sender is not in a voice channel, so we can't alert anyone
          message.reply('You must be in a voice channel to use this command.');
          return;
        }
    
        // Alert all users in the voice channel by pinging them
        voiceChannel.members.forEach(member => {
          message.channel.send(member.toString());
        });
    
        // Confirm that the alert has been sent
        author.send('Alert sent to all users in the voice channel.');
      }
  }



