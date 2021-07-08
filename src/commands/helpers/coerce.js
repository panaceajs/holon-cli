const {
  toUpperCaseVariableName,
  toActionStates,
  toVariableName
} = require('../../utils/strings');

module.exports = {
  name: toUpperCaseVariableName,
  actionTypes: toActionStates,
  props: props => props.map(toVariableName),
  dispatchProps: props => props.map(toVariableName)
};
