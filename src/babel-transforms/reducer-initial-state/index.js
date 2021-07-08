const { completeActionTypes } = require('../utils/state');

module.exports = ({ types: t }) => ({
  name: 'holon-reducer-initial-state',
  visitor: {
    AssignmentPattern(
      path,
      { opts: { actionTypes = {}, stateKey = 'state' } }
    ) {
      if (
        stateKey &&
        t.isIdentifier(path.get('left').node, { name: stateKey }) &&
        t.isObjectExpression(path.get('right').node)
      ) {
        completeActionTypes(path.get('right'), actionTypes);
      }
    }
  }
});
