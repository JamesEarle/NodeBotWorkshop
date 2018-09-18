var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    (session) => {
        builder.Prompts.text(session, "Hello, what is your name?");
    },
    (session, results) => {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", how many years have you been coding?");
    },
    (session, results) => {
        session.userData.years = results.response;
        builder.Prompts.choice(session, "What language do you prefer to code Node with?", ['JavaScript', 'TypeScript', 'CoffeeScript']);
    },
    (session, results) => {
        session.userData.language = results.response.entity;
        session.send("Understood " + session.userData.name + ". You've been coding for " + session.userData.years + " years and you like to use " + session.userData.language);
    }
]);