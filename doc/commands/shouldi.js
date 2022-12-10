const { SlashCommandBuilder } = require('discord.js');


module.exports = { 
    data: new SlashCommandBuilder()
        .setName('shouldi')
        .setDescription('Determines whether or not you should do that thing.'),
        async execute(interaction){
            let successRate = 0;
            for (let i = 0; i < 100; i++){
                if (Math.floor(Math.random() * 2) % 2 == 0){
                   successRate++;  
                }
            }
            const textAnswer = `${randomResponse(successRate)} \nPercentage ${successRate > 50 ? `**Yes:** ${successRate}%` : `**No:** ${100-successRate}%`} *(out of 100 trials)*`
            console.log(textAnswer);
            await interaction.reply(textAnswer);
        }
};


function randomResponse( successRate) {
    const yesResponses = ["Go for it!", "Absolutely.", "Yessir!", "Yup.", "Just do it.", "Yeah...go do it.", "What are you waiting for?"];
    const noResponses = ["No, of course not.", "No way", "Absolutely not.", "Why would you even consider that?", "What are you thinking?"];
    response = successRate > 50 ? yesResponses[Math.floor(Math.random() * yesResponses.length)] : noResponses[Math.floor(Math.random() * noResponses.length)];
    return response; 
}