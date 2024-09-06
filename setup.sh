#!/bin/bash

# Install expo-cli globally
npm install -g expo-cli@4.13.0

# Install and use Node.js version 16 with nvm
nvm install 16
nvm use 16

# Install project dependencies
yarn install

# Start the expo project
expo start
