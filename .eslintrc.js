module.exports = {
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
      "no-console": 0
    }
};
