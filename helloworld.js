var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

bot.dialog('/', (session) => {
    session.send("Hello world!");
});

console.log("Your bot is alive and listening! Try saying something.");