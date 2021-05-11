// const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = {
  distDir: '../dist',
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev }) => {
    const eslintRule = {
      test: /\.tsx?$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        // Emit errors as warnings for dev to not break webpack build.
        // Eslint errors are shown in console for dev, yay :-)
        emitWarning: dev,
      },
    };

    config.module.rules = [].concat(eslintRule, config.module.rules);

    return config;
  },
};
