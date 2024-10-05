module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'preval',
      [
          'module-resolver',
          {
              root: ['./src'],
              extensions: ['.js', '.json'],
              alias: {
                  account: './src/features/Account',
                  auth: './src/features/Auth',
                  browser: './src/features/Browser',
                  cart: './src/features/Cart',
                  core: './src/features/Core',
                  exceptions: './src/features/Exceptions',
                  network: './src/features/Network',
                  places: './src/features/Places',
                  shared: './src/features/Shared',
                  ui: './src/interface',
              },
          },
      ],
  ],
  overrides: [
      {
          "plugins": [
              ["@babel/plugin-transform-private-methods", {
                  "loose": true
              }]
          ]
      }
  ]
  };
};
