const constantCase = require('constant-case');

module.exports = ({ actions: { actionTypes } }) => {
  const actionCreators = Object.keys(actionTypes);
  return `${actionCreators
    .map(
      actionType =>
        `export const ${constantCase(actionType)} = '${constantCase(
          actionType
        )}';`
    )
    .join('\n')}
`;
};
