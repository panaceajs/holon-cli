const constantCase = require('constant-case');

module.exports = ({
  actions: { actionTypes: givenActionTypes, defaultActionTypes }
}) => {
  const actionTypes = givenActionTypes || defaultActionTypes;
  return `${
    givenActionTypes
      ? ``
      : `// 🔥 these action types are pretty random, best create your own
`
  }${actionTypes
    .map(
      actionType =>
        `export const ${constantCase(actionType)} = '${constantCase(
          actionType
        )}';`
    )
    .join('\n')}
`;
};
