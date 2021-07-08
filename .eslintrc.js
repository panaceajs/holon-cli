module.exports = {
    "env": {
      "jest": true
    },
    "extends": [
      "airbnb-base",
      "prettier"
    ],
    "plugins": [
      "prettier"
    ],
    "rules": {
      "prettier/prettier": [
        "error",
        {
          "singleQuote": true,
          "bracketSpacing": true,
          "jsxBracketSameLine": true
        }
      ],
      "no-console": 0,
      "no-buffer-constructor": 0,
      "consistent-return": 0,
      "import/no-extraneous-dependencies": 0
    }
};
