module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src',
          '@navigation': './src/navigation',
          '@theme': './src/theme',
          '@screens': './src/screens',
          '@components': './src/components',
          '@consts': './src/consts',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@providers': './src/providers',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
