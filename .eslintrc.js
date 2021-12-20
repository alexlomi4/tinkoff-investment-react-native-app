module.exports = {
  env: {
    "react-native/react-native": true
  },
  extends: [
    'plugin:react/recommended',
    "plugin:react-native/all",
    'airbnb-typescript',
    "plugin:react-hooks/recommended",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    "project": ["./tsconfig.json"]
  },
  ignorePatterns: ['.eslintrc.js', 'babel.config.js', 'metro.config.js', 'jest.config.js'],
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
  }},
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx', '.tsx']}],
    "@typescript-eslint/object-curly-spacing": "off",
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "error", // Checks effect dependencies
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error", {functions: false}],
    "react/require-default-props": "off",
    "react-native/no-color-literals": "off",
  },
};
