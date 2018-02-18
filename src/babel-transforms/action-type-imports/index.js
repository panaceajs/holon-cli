const constantCase = require('constant-case');
const { addImport } = require('../utils/import');

module.exports = () => ({
  name: 'holon-action-type-imports',
  visitor: {
    Program(
      path,
      { opts: { actionTypes = [], targetPath = '../action-types' } }
    ) {
      if (Object.keys(actionTypes).length) {
        addImport(
          path,
          [...Object.keys(actionTypes).map(constantCase)],
          targetPath
        );
      }
    }
  }
});
