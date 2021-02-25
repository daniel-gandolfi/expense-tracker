  const isNaNErrorMessage =
    'Please use Number.isFinite instead:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN';
    const isFiniteErrorMessage =
    'Please use Number.isFinite instead:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite';
    const definePropertyErrorMessage =
    'Please use Object.defineProperty instead:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty';

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
    project: 'tsconfig.json',
    createDefaultProgram: true,
    ecmaFeatures: {
      jsx: true
    },
    warnOnUnsupportedTypeScriptVersion: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:jsx-a11y/recommended',
      'plugin:react/recommended',
      'prettier',
      'prettier/@typescript-eslint'
  ],
  plugins: ['prettier', '@typescript-eslint', 'import', 'jsx-a11y', 'react', 'react-hooks'],
  rules: {
    'prettier/prettier': 'warn',
    curly: 'warn',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'no-nested-ternary': 'error',
    '@typescript-eslint/prefer-optional-chain': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-regexp-exec': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars': [
        'error',
      {
        args: 'none',
        ignoreRestSiblings: true
      }
    ],
    'no-console': ['error'],
    'import/newline-after-import': 'warn',
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'react/no-render-return-value': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/display-name': 'off',
    'no-restricted-properties': [
        'error',
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated'
      },
      {
        object: 'global',
        property: 'isFinite',
        message: isFiniteErrorMessage
      },
      {
        object: 'self',
        property: 'isFinite',
        message: isFiniteErrorMessage
      },
      {
        object: 'window',
        property: 'isFinite',
        message: isNaNErrorMessage
      },
      {
        object: 'global',
        property: 'isNaN',
        message: isNaNErrorMessage
      },
      {
        object: 'self',
        property: 'isNaN',
        message: isNaNErrorMessage
      },
      {
        object: 'window',
        property: 'isNaN',
        message: isNaNErrorMessage
      },
      {
        property: '__defineGetter__',
        message: definePropertyErrorMessage
      },
      {
        property: '__defineSetter__',
        message: definePropertyErrorMessage
      }
    ]
  }
  };
