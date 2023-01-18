require('dotenv').config()

const {Client,GatewayIntentBits} = require('discord.js')
const client = new Client({intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// connect to openAI API
const {Configuration , OpenAIApi} = require('openai')
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration)

client.on('messageCreate',async function(message){
    try {
        if(message.author.bot || message.content.startsWith('!') == false){
            return
        } 
        const gptResponse = await openai.createCompletion({
            model:"davinci",
            prompt:'ChatGPT is a friendly chatbot.\n\
            ChatGPT: Hello, how are you?' +
            message.author.username + message.content +
            "ChatGPT: ",
            temperature:0.9,
            max_tokens:100,
            stop:["ChatGPT:", "RJ:"],
        })
        message.reply(message.author + gptResponse.data.choices[0].text);
        return;
    } catch (e) {
        console.log(e)
    }
})

client.login(process.env.DISCOED_TOKEN)
console.log("bot is online!")