const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

const aliases = {
  "@assets": "./assets",
  "@styles": "./src/styles",
  "@components": "./src/components",
  "@atoms": "./src/components/atoms",
  "@molecules": "./src/components/molecules",
  "@organisms": "./src/components/organisms",
  "@templates": "./src/components/templates",
  "@pages": "./src/components/pages",
  "@screens": "./src/screens",
  "@reducers": "./src/reducers"
};

const babelLoaderRules = {
  test: /\.ts/,
  loader: 'babel-loader',
  options: {
    presets: ['babel-preset-expo'],
  },
};

// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // If you want to add a new alias to the config.
  config.resolve.alias = {
    ...config.resolve.alias,
    ...aliases,
  };
  config.module.rules = [
    ...config.module.rules,
    babelLoaderRules,
];
  // Finally return the new config for the CLI to use.
  return config;
};