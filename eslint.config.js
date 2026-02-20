import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'less.js-master/**',
      '**/*.min.js'
    ]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off'
    }
  }
];
