const constantCase = require('constant-case');

module.exports = ({ actions: { names, defaultNames } }) => {
  const actionNames = names || defaultNames;
  return `${
    names
      ? ``
      : `// 🔥 these action types are pretty random, best create your own
`
  }${actionNames
    .map(
      actionName =>
        `export const ${constantCase(actionName)} = '${constantCase(
          actionName
        )}';`
    )
    .join('\n')}
`;
};
