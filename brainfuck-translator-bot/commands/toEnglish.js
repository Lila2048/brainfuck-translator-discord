const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('to-english')
        .setDescription('Translate Brainfuck to English')
        .addStringOption(option =>
            option.setName('string')
                .setDescription('The brainfuck code you want to translate to English')
                .setRequired(true)
        ),

    async execute(interaction) {

        const bfCode = interaction.options.getString('string');

        const memory = new Array(30000).fill(0);
        let ptr = 0;
        let output = '';
        const loopStack = [];
        const code = bfCode.split('');
        const loopMap = new Map();
    
        // Build loop map for [ and ] positions
        const openBrackets = [];
    
        for (let i = 0; i < code.length; i++) {
            if (code[i] === '[') {
                openBrackets.push(i);
            } else if (code[i] === ']') {
                const start = openBrackets.pop();
                loopMap.set(start, i);
                loopMap.set(i, start);
            }
        }
    
        for (let i = 0; i < code.length; i++) {
            const cmd = code[i];
            switch (cmd) {
                case '>': ptr++; break;
                case '<': ptr--; break;
                case '+': memory[ptr] = (memory[ptr] + 1) % 256; break;
                case '-': memory[ptr] = (memory[ptr] + 255) % 256; break;
                case '.': output += String.fromCharCode(memory[ptr]); break;
                case '[':
                    if (memory[ptr] === 0) {
                        i = loopMap.get(i);
                    }
                    break;
                case ']':
                    if (memory[ptr] !== 0) {
                        i = loopMap.get(i);
                    }
                    break;
            }
        }

        await interaction.reply({ content: output, flags: 64});
    }
};