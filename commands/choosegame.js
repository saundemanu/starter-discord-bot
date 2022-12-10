const { SlashCommandBuilder } = require('discord.js');
const { execute } = require('./ping');

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('pickgame')
        .setDescription('picks a random game from user input!'),
        async execute(interaction){
            const games = ['Siege', 'Valorant', 'Multiversus', 'Lost Ark', 'Fall Guys', 'Street Fighter V'];
            const responses = ['Unlucky.', 'Try going outside instead.', 'Finally!', '...yikes.', 'Why would you even play that!?'];
            await interaction.reply(`*The game chosen was*: \n**${games[Math.floor(Math.random() * games.length)]} \n**${responses[Math.floor(Math.random() * responses.length)]}`);
        }
};