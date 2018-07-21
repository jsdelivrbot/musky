/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					 ______     ______     ______   __  __     __     ______
					/\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
					\ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
					 \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
						\/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
	for a user.

# RUN THE BOT:

	Create a new app via the Slack Developer site:

		-> http://api.slack.com

	Get a Botkit Studio token from Botkit.ai:

		-> https://studio.botkit.ai/

	Run your bot from the command line:

		clientId=<MY SLACK TOKEN> clientSecret=<my client secret> PORT=<3000> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js

# USE THE BOT:

		Navigate to the built-in login page:

		https://<myhost.com>/login

		This will authenticate you with Slack.

		If successful, your bot will come online and greet you.


# EXTEND THE BOT:

	Botkit has many features for building cool and useful bots!

	Read all about it here:

		-> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
require('dotenv').config();

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
	console.info("Improperly configured");
	process.exit(1);
}

const Botkit = require('botkit');
const firebaseStorage = require('botkit-storage-firebase')({
	databaseURL: 'https://musky-7daee.firebaseio.com/'
});

const bot_options = {
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	// debug: true,
	scopes: ['bot'],
	studio_token: process.env.studio_token,
	studio_command_uri: process.env.studio_command_uri,
	storage: firebaseStorage
};

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

webserver.get('/', function(req, res){
	res.render('index', {
		domain: req.get('host'),
		protocol: req.protocol,
		glitch_domain:  process.env.PROJECT_DOMAIN,
		layout: 'layouts/default'
	});
});
// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

const normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
	require("./skills/" + file)(controller);
});
