var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', '138.197.0.221', server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'af7a0a1b-f6df-4767-bc8a-0b79f103bc3c',
    appPassword: 'idETZLFq3dh0JKkOaZioW4q'
});
var bot = new builder.UniversalBot(connector, {persistConversationData: true});

server.post('/api/messages', connector.listen());

bot.dialog('/', function (session, args) {
    if (!session.userData.greeting) {
        session.send("Hello. What is your name?");
        session.userData.greeting = true;
    } else if (!session.userData.name) {
        console.log("Begin");
        getName(session);
    } else if (!session.userData.email) {
        console.log("Name is: " + session.userData.name);
        getEmail(session);
    } else if (!session.userData.password) {
        console.log("Name is: " + session.userData.name);
        console.log("Email is: " + session.userData.email);
        getPassword(session);
    } else {
        session.userData = null;
    }
    session.endDialog();
});


function getName(session) {
    name = session.message.text;
    session.userData.name = name;
    session.send("Hello, " + name + ". What is your Email ID?");
}

function getEmail(session) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email = session.message.text;
    if (re.test(email)) {
        session.userData.email = email;
        session.send("Thank you, " + session.userData.name + ". Please set a new password.");
    } else {
        session.send("Please type a valid email address. For example: test@hotmail.com");
    }
}

function sendData(data, cb) {
    http.get("http://local.dev/aplostestbot/saveData.php?name=" + data.name + "&email=" + data.email + "&password=" + data.password, function (res) {
        var msg = '';
        res.on("data", function (chunk) {
            msg += chunk;
        });

        res.on('end', function () {
            cb(msg);
        });

    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });
}