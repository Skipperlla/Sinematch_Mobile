module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@app/assets': './src/assets',
          '@app/components': './src/components',
          '@app/constants': './src/constants',
          '@app/contexts': './src/contexts',
          '@app/hooks': './src/hooks',
          '@app/lang': './src/lang',
          '@app/store': './src/store',
          '@app/navigation': './src/navigation',
          '@app/screens': './src/screens',
          '@app/api': './src/api',
          '@app/styles': './src/styles',
          '@app/types': './src/types',
          '@app/utils': './src/utils',
        },
      },
    ],
  ],
};
