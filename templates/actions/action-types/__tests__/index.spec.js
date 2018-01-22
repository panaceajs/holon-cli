const constantCase = require('constant-case');

module.exports = ({ actions: { names, defaultNames, state } }) => {
  const actionNames = names || defaultNames;
  const constantNames = actionNames.map(constantCase);
  return `import { ${constantNames.join(', ')} } from '../';
${
    names
      ? ``
      : `
// 🔥 these action types tests are generated by default, you want your own types here`
  }
describe('\`${state}\` action types', () => {${constantNames
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
