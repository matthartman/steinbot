/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - LITERAL slot: demonstrates literal handling for a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('AlexaSkill'),
    recipes = require('recipes'),
	advices = require('advices'),
	wifis = require('wifis');
var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * MinecraftHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var MinecraftHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MinecraftHelper.prototype = Object.create(AlexaSkill.prototype);
MinecraftHelper.prototype.constructor = MinecraftHelper;

MinecraftHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechOutput = "Welcome to Steinbot, the official alexa app of Pete and Alli Stein. You can ask me to welcome someone I know by saying so and so is here, like Alli is here. Or you can ask me for marriage advice. When your friends are visiting, I can give them the wifi code if they need it. ... Now, what can I help you with?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechOutput, repromptText);
};

MinecraftHelper.prototype.intentHandlers = {
    WelcomeIntent: function (intent, session, response) {
        var personName = intent.slots.Person.value.toLowerCase();
        var cardTitle = "Welcome for " + personName;
        var recipe = recipes[personName];
		
		var wantMore = "Want to hear some wedding advice from your friends? Just say Advice. Or you can say exit.";
		var noMore = "Are you ignoring me?  Either say Advice, Wifi, or Exit. You can always wake me up again later by saying Alexa open Steinbot."
		
	
        if (recipe) {
            //response.tellWithCard(recipe, cardTitle, recipe);
			response.ask(recipe + wantMore, noMore);
        } else {
            response.ask("I'm sorry, I currently do not know how to welcome " + personName + ". I can welcome Nancy, Pete, Jenny, and others in the Stein and Kronick family. Who shall I welcome?", "What else can I help with?");
        }
    },	
    AdviceIntent: function (intent, session, response) {
        var cardTitle = "Marriage Advice";

 	    var randomNumber = Math.floor(Math.random() * advices.length);
		var advice = advices[randomNumber];
		console.log("randomNumber is " + randomNumber);

		var wantMore = "Come back tomorrow for more marriage advice. Or you can ask for more advice now. Or you can say Exit.";
		var noMore = "Are you ignoring me?  Either say Advice, Wifi, or Exit. You can always wake me up again later by saying Alexa open Steinbot."

		var speechOutput = {
			speech: "<speak>" + advice + wantMore + "</speak>",
		    type: "SSML",
		};
		
		
		//var speechOutput = "<speak>This output speech uses SSML <audio src='https://s3.amazonaws.com/sounds226/boom.mp3'></speak>";
        var repromptText = "You can say things like, Alli is here, or marriage advice or you can ask me for Pete and Alli's wifi, or you can say exit... Now, what can I help you with?";
        //response.ask({'type': 'SSML', 'speech': speechOutput}, repromptText);
		//response.ask(speechOutput, repromptText);
		//response.tell(speechOutput);
		response.ask(speechOutput, noMore);
		
    },
    WifiIntent: function (intent, session, response) {
        var cardTitle = "Wifi Info";

		var wifi_name = wifis["name"];
		var wifi_pass = wifis["password"];

		var wantMore = "If you need to hear it again, just say repeat wifi or just say exit.";
		var noMore = "Are you ignoring me?  I assume you want to exit."

		var speechOutput = {
			speech: "<speak> The wifi network name is " + wifi_name + " and the password is " + wifi_pass + " . . . " + wantMore + "</speak>",
		    type: "SSML",
		};
		
		
		//var speechOutput = "<speak>This output speech uses SSML <audio src='https://s3.amazonaws.com/sounds226/boom.mp3'></speak>";
        var repromptText = "You can say things like, Alli is here, or marriage advice or you can ask me for Pete and Alli's wifi, or you can say exit... Now, what can I help you with?";
        //response.ask({'type': 'SSML', 'speech': speechOutput}, repromptText);
		//response.ask(speechOutput, repromptText);
		//response.tell(speechOutput);
		response.ask(speechOutput, noMore);
		
    },
	
    HelpIntent: function (intent, session, response) {
        var cardTitle = intent.name;
        var speechOutput = "You can ask me to welcome people into the room by saying welcome Alli, or you can ask me for marriage advice or the wifi information, or say exit... Now, what can I help you with?";
        response.ask(speechOutput, speechOutput);
    }
};

exports.handler = function (event, context) {
    var minecraftHelper = new MinecraftHelper();
    minecraftHelper.execute(event, context);
};
