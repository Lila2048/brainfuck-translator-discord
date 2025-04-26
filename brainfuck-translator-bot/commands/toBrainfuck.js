const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('to-brainfuck')
        .setDescription('Translate a string to Brainfuck')
        .addStringOption(option =>
            option.setName('string')
                .setDescription('The string you want to translate to Brainfuck')
                .setRequired(true)
        ),

    async execute(interaction) {

        const text = interaction.options.getString('string');

        let result = '';
        let current = 0;
    
        for (let i = 0; i < text.length; i++) {
            const target = text.charCodeAt(i);
            let diff = target - current;
    
            if (diff > 0) {
                result += '+'.repeat(diff);
            } else if (diff < 0) {
                result += '-'.repeat(-diff);
            }
    
            result += '.';
            current = target;
        }
        await interaction.reply({ content: result, flags: 64});
    }
};
