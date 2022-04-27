import Constants from 'expo-constants';

const API_URL = Constants.manifest?.extra?.API_URL;
const API_VERSION = Constants.manifest?.extra?.API_VERSION;
const BASE_URL = 'https://test-edge-application-processing-appsvc.azurewebsites.net';
const BASE_URL_NODE = 'https://test-edge-application-processing-appsvc.azurewebsites.net';
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
  channelName: '123',
  appId: '2a5adc280d084e008d7619f9b0a2c0c6',
  token: '0062a5adc280d084e008d7619f9b0a2c0c6IABbU969f2mMV8YXMYTLYfsohZbjRNfWbaQwLIVMp4PSKdJjSIgAAAAAIgDQ1fuzFIBmYgQAAQATgGZiAgATgGZiAwATgGZiBAATgGZi',
}

export {
  BASE_URL,
  API_VERSION,
  BASE_URL_NODE,
  firebaseConfig,
  agoraTestConfig,
}