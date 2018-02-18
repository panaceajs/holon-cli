const camelCase = require('camel-case');
const ucf = require('upper-case-first');

const toVariableName = name =>
  camelCase(
    name
      .replace(/[^a-zA-Z0-9 :]/g, '')
      .replace(/^[0-9:]+/g, '')
      .trim()
  );

const toActionState = name => {
  const [actionType, stateProp] = name.split(':');
  const functionPropName = toVariableName(actionType);

  const statePropName = stateProp || `${functionPropName}Value`;
  return { [functionPropName]: statePropName };
};

const toActionStates = actionTypes =>
  actionTypes.reduce(
    (actionStates, actionType) => ({
      ...actionStates,
      ...toActionState(actionType)
    }),
    {}
  );

const toUpperCaseVariableName = name => ucf(toVariableName(name));

module.exports = {
  toVariableName,
  toUpperCaseVariableName,
  toActionState,
  toActionStates
};
