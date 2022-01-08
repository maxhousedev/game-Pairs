module.exports = {
  root: true,

  extends: ['airbnb-base', 'eslint:recommended', 'prettier'],

  env: {
    browser: true,
    es2021: true,
  },

  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },

  rules: {
    'no-alert': 0,
    'no-param-reassign': [2, { props: false }],
    'no-plusplus': 0,
    'no-iterator': 0,
    'no-restricted-syntax': [2, 'WithStatement'],
    'func-style': 0,
    'prettier/prettier': 2,
  },

  plugins: ['prettier'],
};
