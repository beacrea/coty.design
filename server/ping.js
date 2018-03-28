// Creds
let accountSid = null; // Your Account SID from www.twilio.com/console
let authToken = null;   // Your Auth Token from www.twilio.com/console

// Basics
let twilio = require('twilio');
let client = new twilio(accountSid, authToken);

// Phone Directory
let contact = {
  jenny: '+18675309',
  bruce: '+17762323'
};

// Data Vars
let currentTime = new Date();
let toNumber = contact.jenny;
let fromNumber = contact.bruce;


// Message Magic
client.messages.create({
  body: 'YO! This is the BeasleyBot!\n\nI\'m a robot built by Coty Beasley (http://coty.design) to send messages via SMS.\n\nI was sent on ' + currentTime,
  to: toNumber,  // Text this number
  from: fromNumber // From a valid Twilio number
})
.then((message) => console.log(message.sid));
