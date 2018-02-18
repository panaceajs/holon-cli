const constantCase = require('constant-case');
const camelCase = require('camel-case');

module.exports = ({
  actions: { actionTypes: givenActionTypes, defaultActionTypes }
}) => {
  const actionTypes = Object.keys(givenActionTypes) || defaultActionTypes;
  return `import { createAction } from 'redux-actions';
import { ${actionTypes.map(constantCase).join(', ')} } from '../action-types';
${
    givenActionTypes
      ? ``
      : `
// 🔥 these action types are pretty random, best create your own`
  }
${actionTypes
    .map(
      actionType =>
        `export const ${camelCase(actionType)} = createAction(${constantCase(
          actionType
        )});`
    )
    .join('\n')}
`;
};
