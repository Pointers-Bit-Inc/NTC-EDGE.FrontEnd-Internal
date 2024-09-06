```batch
@echo off

:: Install Expo CLI
npm install -g expo-cli@4.13.0

:: Install Node.js Version 16 using nvm
nvm install 16
nvm use 16

:: Install Project Dependencies
yarn install

:: Start Expo
expo start