var admin = require("firebase-admin");
const dotenv = require('dotenv')

dotenv.config()

const options = {
  priority: "high"
}

admin.initializeApp({
  credential: admin.credential.cert(process.env.serviceAccount),
  databaseURL: process.env.databaseURL
});

function sendNotification(title, message, image, url = "", topic, type) {
    const payload = { 
    notification : {
        title : title,
        body : message,
        content_available : "true",
        image:image,
        url:url,
        tipe:type
    }, 
    data: {
        title : title,
        body : message,
        content_available : "true",
        image:image,
        url:url,
        tipe:type        
    }
}

    admin.messaging().sendToTopic(topic, payload, options).then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
}


module.exports = { sendNotification }