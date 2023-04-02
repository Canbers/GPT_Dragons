const functions = require('firebase-functions');
let firebaseConfig = {};

if (process.env.NODE_ENV !== "production") {
  // Import dotenv for development environment
  const dotenv = require("dotenv");
  dotenv.config();

  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };
} else {
  firebaseConfig = {
    apiKey: functions.config().appconfig.api_key,
    authDomain: functions.config().appconfig.auth_domain,
    projectId: functions.config().appconfig.project_id,
    storageBucket: functions.config().appconfig.storage_bucket,
    messagingSenderId: functions.config().appconfig.messaging_sender_id,
    appId: functions.config().appconfig.app_id,
    measurementId: functions.config().appconfig.measurement_id,
  };
}

module.exports = firebaseConfig;
