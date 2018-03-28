// Creds
let accountSid = 'ACb4d5303cb66f41ea220f25ac6db15905'; // Your Account SID from www.twilio.com/console
let authToken = 'c66b577b251c9ef18c7dbf7758b7dbbc';   // Your Auth Token from www.twilio.com/console

// Basics
let twilio = require('twilio');
let client = new twilio(accountSid, authToken);

// Phone Directory
let contact = {
  mindy: '+19134268396',
  coty: '+18162002689',
  beasleyBot: '+14158401420',
  sean: '+18162001161',
  liz: '+18282283437',
  pitichoke: '+12064651048',
  ariel: '+12103265459'
};

// Data Vars
let currentTime = new Date();
let toNumber = contact.ariel;
let fromNumber = contact.beasleyBot;


// Message Magic
client.messages.create({
  body: 'YO! This is the BeasleyBot!\n\nI\'m a robot built by Coty Beasley (http://coty.design) to send messages via SMS.\n\nI was sent on ' + currentTime,
  to: toNumber,  // Text this number
  from: fromNumber // From a valid Twilio number
})
.then((message) => console.log(message.sid));
