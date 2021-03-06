const constantCase = require('constant-case');

module.exports = ({
  actions: { actionTypes: givenActionTypes, defaultActionTypes, stateNamespace }
}) => {
  const actionTypes = givenActionTypes || defaultActionTypes;
  const constantNames = actionTypes.map(constantCase);
  return `import { ${constantNames.join(', ')} } from '../';
${
    givenActionTypes
      ? ``
      : `
// 🔥 these action types tests are generated by default, you want your own types here`
  }
describe('\`${stateNamespace}\` action types', () => {${constantNames
    .map(
      constantName => `
  it('should export \`${constantName}\` type', () => {
    expect(${constantName}).toBe('${constantName}');
  });`
    )
    .join('\n')}
});
`;
};
