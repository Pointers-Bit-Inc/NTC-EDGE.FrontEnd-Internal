const BASE_URL = 'http://127.0.0.1:3000';
const firebaseConfig = {
  apiKey: "AIzaSyASZc6WOG4-kKMf7I98p_5aRjbXHzWsmyU",
  authDomain: "ntc-edge-ea034.firebaseapp.com",
  projectId: "ntc-edge-ea034",
  storageBucket: "ntc-edge-ea034.appspot.com",
  messagingSenderId: "284544636149",
  appId: "1:284544636149:web:0ec802a1b2a8b6c0c4e1bc",
  measurementId: "${config.measurementId}"
}

const agoraTestConfig = {
  channelName: 'ntcedge',
  appId: '90bcc0f561a0427187789a4b0aed441a',
  token: '00690bcc0f561a0427187789a4b0aed441aIADbdwt6zaDdYuXRkLoNNsRcGry8cx68u/2YA7cBfChSbPamhlwAAAAAEADiSs2f48m5YQEAAQDjyblh',
}

export {
  BASE_URL,
  firebaseConfig,
  agoraTestConfig,
}