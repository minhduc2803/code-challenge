module.exports = {
    root: true,
    env: {
      browser: true,
      es2020: true,
      node: true,
      jest: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: ['react', 'react-hooks', 'jsx-a11y'],
    rules: {
      // React rules
      'react/prop-types': 'off', // Disable prop-types as we're not using them
      'react/jsx-uses-react': 'off', // Not needed with new JSX transform
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
      'react/self-closing-comp': 'warn', // Ensure self-closing tags
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error', // Enforce rules of hooks
      'react-hooks/exhaustive-deps': 'warn', // Check effect dependencies
      
      // General rules
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_' 
      }], // Warn about unused variables except those starting with _
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn about console statements except warn and error
      'prefer-const': 'warn', // Prefer const over let when possible
      'no-var': 'error', // Disallow var
      'arrow-body-style': ['warn', 'as-needed'], // Use concise arrow functions when possible
      
      // Accessibility rules
      'jsx-a11y/alt-text': 'warn', // Ensure alt text for images
      'jsx-a11y/anchor-has-content': 'warn', // Ensure anchors have content
      'jsx-a11y/aria-props': 'warn', // Ensure aria props are valid
      'jsx-a11y/aria-proptypes': 'warn', // Ensure aria values are valid
      'jsx-a11y/aria-role': 'warn', // Ensure aria roles are valid
      
      // Style rules
      'quotes': ['warn', 'single', { avoidEscape: true }], // Use single quotes
      'semi': ['warn', 'always'], // Require semicolons
      'indent': ['warn', 2], // 2 space indentation
      'comma-dangle': ['warn', 'always-multiline'], // Trailing commas in multiline
      'object-curly-spacing': ['warn', 'always'], // Spaces in object literals
    },
    overrides: [
      // Override for test files
      {
        files: ['**/__tests__/**/*.{js,jsx}', '**/*.{test,spec}.{js,jsx}'],
        env: {
          jest: true,
        },
        rules: {
          // Relax certain rules for test files
          'no-unused-expressions': 'off',
        },
      },
    ],
  };