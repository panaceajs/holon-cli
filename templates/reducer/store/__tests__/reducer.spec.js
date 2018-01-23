const constantCase = require('constant-case');
const camelCase = require('camel-case');

module.exports = ({
  reducer: { actionTypes: givenActionTypes, defaultActionTypes, stateNamespace }
}) => {
  const actionTypes = givenActionTypes || defaultActionTypes;

  return `import reducer from '../reducer';
${
    actionTypes
      ? `import { ${actionTypes
          .map(camelCase)
          .join(', ')} } from '../../actions';`
      : ``
  }

describe('\`${stateNamespace}\` reducer', () => {
  it('should exist', () => {
    expect(reducer).toBeDefined();
  });

  it('should return default state', () => {
    const next = reducer(undefined, { type: 'UNKNOWN_TYPE'});
    expect(next).toMatchSnapshot();
  });
${
    actionTypes
      ? `
${actionTypes
          .map(
            actionType => `  it('should handle \`${constantCase(
              actionType
            )}\`', () => {
    const next = reducer(undefined, ${camelCase(actionType)}());
    expect(next).toMatchSnapshot();
    const next2 = reducer(next, ${camelCase(actionType)}('${camelCase(
              actionType
            )}-value'));
    expect(next2).toMatchSnapshot();
  });`
          )
          .join('\n\n')}`
      : ``
  }
});
`;
};
