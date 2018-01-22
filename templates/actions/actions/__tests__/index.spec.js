const constantCase = require('constant-case');
const camelCase = require('camel-case');

module.exports = ({
  actions: { actionTypes: givenActionTypes, defaultActionTypes, stateNamespace }
}) => {
  const actionTypes = givenActionTypes || defaultActionTypes;

  return `import { ${actionTypes
    .map(constantCase)
    .join(', ')} } from '../../action-types';
import { ${actionTypes.map(camelCase).join(', ')} } from '../';
${
    givenActionTypes
      ? ``
      : `
// 🔥 these action creator tests are generated by default, you want your own types here`
  }
describe('\`${stateNamespace}\` action creators', () => {${actionTypes
    .map(actionType => {
      const camelCasedName = camelCase(actionType);
      const constantCasedName = constantCase(actionType);
      return `
  it('should export \`${camelCasedName}\` function', () => {
    expect(${camelCasedName}).toBeDefined();
    expect(${camelCasedName}()).toEqual({
      type: ${constantCasedName}
    });
  });`;
    })
    .join('\n')}
});
`;
};
