const constantCase = require('constant-case');
const camelCase = require('camel-case');

module.exports = ({
  reducer: { actionTypes: givenActionTypes, defaultActionTypes }
}) => {
  const actionTypes = givenActionTypes || defaultActionTypes;

  return `import { ${actionTypes
    .map(constantCase)
    .join(', ')} } from '../action-types';

export default (${
    givenActionTypes
      ? `
  state = {
${actionTypes
          .map(actionType => `    ${camelCase(actionType)}: false`)
          .join(',\n')}
  }`
      : `state = {}`
  },
  { type, payload, error }
) => {
  switch (type) {${
    givenActionTypes
      ? `${actionTypes
          .map(
            actionType => `
    case ${constantCase(actionType)}: {
      return { ...state, ${camelCase(actionType)}: payload || true, error };
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
