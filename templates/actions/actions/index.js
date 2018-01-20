const constantCase = require('constant-case');
const camelCase = require('camel-case');

module.exports = ({ actions: { names, defaultNames } }) => {
  const actionNames = names || defaultNames;
  return `import { createAction } from 'redux-actions';
import { ${actionNames.map(constantCase).join(', ')} } from '../action-types';
${
    names
      ? ``
      : `
// 🔥 these action types are pretty random, best create your own`
  }
${actionNames
    .map(
      actionName =>
        `export const ${camelCase(actionName)} = createAction(${constantCase(
          actionName
        )});`
    )
    .join('\n')}
`;
};
