module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  // extends: ['@react-native-community', 'airbnb-typescript', 'prettier'],

  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react-native/no-inline-styles': 'off',
    'import/prefer-default-export': 'off',
    // 'no-console': 'warn',
    'react-hooks/exhaustive-deps': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.native.js'],
      },
    },
  },
};
