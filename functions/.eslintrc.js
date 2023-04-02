module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'linebreak-style': ['error', 'unix'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'max-len': ['error', { 'code': 80, 'ignoreComments': true, 'ignoreUrls': true }],
    'no-console': 'warn',
    'no-var': 'error',
    'comma-dangle': ['error', 'always-multiline'],
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
