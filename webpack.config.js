const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

const aliases = {
  "@assets": path.resolve(__dirname, "assets"),
  "@styles": path.resolve(__dirname, "src/styles"),
  "@components": path.resolve(__dirname, "src/components"),
  "@atoms": path.resolve(__dirname, "src/components/atoms"),
  "@molecules": path.resolve(__dirname, "src/components/molecules"),
  "@organisms": path.resolve(__dirname, "src/components/organisms"),
  "@templates": path.resolve(__dirname, "src/components/templates"),
  "@pages": path.resolve(__dirname, "src/components/pages"),
  "@screens": path.resolve(__dirname, "src/screens"),
  "@reducers": path.resolve(__dirname, "src/reducers"),
  "@utils": path.resolve(__dirname, "src/utils")
};

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add aliases
  config.resolve.alias = {
    ...config.resolve.alias,
    ...aliases
  };

  // Add support for additional extensions
  config.resolve.extensions.push('.web.js', '.web.ts', '.web.tsx');

  // Add Babel loader rules
  config.module.rules.push({
    test: /\.ts$/,
    loader: 'babel-loader',
    options: {
      presets: ['babel-preset-expo'],
    },
  });

  // Add ProvidePlugin for polyfills (if necessary)
  config.plugins.push(

  );


  // Define the node property correctly
  config.node = {
    __dirname: true,
    __filename: true,
    global: true, // You can set this to false if you don't need global
  };

  // Disable source maps
  config.devtool = false;

  // Optimization settings
  config.optimization = {
    splitChunks: {
      minSize: 10000,
      maxSize: 250000,
    }
  };

  // Disable performance hints
  config.performance = {
    hints: false
  };

  // Set mode to production
  config.mode = 'production';

  // Configure webpack-dev-server if needed (example)
  config.devServer = {
    allowedHosts: 'all',
    compress: true,
    port: 3000, // example port
  };

  return config;
};
