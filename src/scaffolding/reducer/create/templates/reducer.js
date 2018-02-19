const constantCase = require('constant-case');

module.exports = ({ reducer: { actionTypes = {} } }) => {
  const actionCreators = Object.keys(actionTypes);

  return `import { ${actionCreators
    .map(constantCase)
    .join(', ')} } from '../action-types';
export default (
  state = {
    ${actionCreators
      .map(
        actionCreator =>
          `    ${actionTypes[actionCreator] || actionCreator}: '${actionTypes[
            actionCreator
          ] || actionCreator}-initial-value'`
      )
      .join(',\n')}
  },
  { type, payload, error }
) => {
  switch (type) {${
    actionCreators
      ? `${actionCreators
          .map(
            actionCreator => `
    case ${constantCase(actionCreator)}: {
      return { ...state, ${actionTypes[actionCreator] ||
        actionCreator}: payload || '${actionTypes[actionCreator] ||
              actionCreator}-value', error };
    }`
          )
          .join('')}`
      : ``
  }
    default:
      return state;
  }
};
`;
};
