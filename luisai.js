// Left off on page 21/22 of Daniels workshop

var builder = require('botbuilder');
var private = require('private/')

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

// LUIS Model URL
var model = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/946cefe3-da50-436b-8f04-0728d06fcbdc?subscription-key=${private.LUIS_KEY}&verbose=true&timezoneOffset=0&q=`;
var recognizer = new builder.LuisRecognizer(model);
bot.recognizer(recognizer);

var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog('/', dialog);

dialog.matches('Calendar.Add', [
    // Session, Results, Next
    (s, r, n) => { resolveEntities(s, r, n) },
    (s, r, n) => { promptForMissingSubject(s, r, n) },
    (s, r, n) => { promptForMissingDay(s, r, n) },
    (s, r, n) => { promptForMissingTime(s, r, n) },
    (s, r, n) => { promptForMissingLocation(s, r, n) }
]);

dialog.matches('Calendar.Delete', builder.DialogAction.send('Deleting from your calendar...'));
dialog.onDefault(builder.DialogAction.send('I\'m sorry, I didn\'t understand that. Try saying \"add to my calendar\" or \"reschedule an event\"'))

function resolveEntities(session, results, next) {
    var subject = builder.EntityRecognizer.findEntity(results.entities, 'Calendar.Subject');
    var day = builder.EntityRecognizer.findEntity(results.entities, 'Calendar.Day');
    var time = builder.EntityRecognizer.findEntity(results.entities, 'Calendar.Time');
    var location = builder.EntityRecognizer.findEntity(results.entities, 'Calendar.Location');

    var event = session.dialogData.event = {
        subject: subject ? subject.entity : null,
        day: day ? day.entity : null,
        time: time ? time.entity : null,
        location: location ? location.entity : null
    }
    console.log(JSON.stringify(event));
    console.log(session.dialogData.event);

    if (!event.subject) {
        builder.Prompts.text(session, "What would you like to schedule?");
    } else {
        // Prompt for any missing values
        next();
    }
}

function promptForMissingSubject(session, results, next) {
    var event = session.dialogData.event;
    if (results.response) {
        event.subject = results.response;
    }

    // Prompt for next missing value, if needed
    if (!event.day) {
        builder.Prompts.text(session, 'What day will this event be?');
    } else {
        next();
    }
}

function promptForMissingDay(session, results) {
    var event = session.dialogData.event;
    if (results.response) {
        event.day = results.response;
    }

    // Prompt for next missing value, if needed
    if (!event.time) {
        builder.Prompts.text(session, 'What time will this event take place?');
    } else {
        next();
    }
}

function promptForMissingTime(session, results) {
    var event = session.dialogData.event;
    if (results.response) {
        event.time = results.response;
    }

    // Prompt for next missing value, if needed
    if (!event.location) {
        builder.Prompts.text(session, 'Where will this event be?');
    } else {
        next()
    }
}

function promptForMissingLocation(session, results) {
    var event = session.dialogData.event;
    if (results.response) {
        event.location = results.response;
    }

    // Prompt for next missing value, if needed
    if (!event.location) {
        builder.Prompts.text(session, 'Where will this event be?');
    } else {
        // insert given response data here
        var event = `Subject: ${session.dialogData.event.subject}\n`;
        event += `Day: ${session.dialogData.event.day}\n`;
        event += `Time: ${session.dialogData.event.time}\n`;
        event += `Location: ${session.dialogData.event.location}\n`;

        session.send(`Great, this is what I'll schedule for you.\n${event}`);
    }
}