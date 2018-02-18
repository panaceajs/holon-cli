const camelCase = require('camel-case');
const { addImport } = require('../utils/import');

module.exports = () => ({
  name: 'holon-action-creators-imports',
  visitor: {
    Program(path, { opts: { actionTypes = [], targetPath = '../actions' } }) {
      if (Object.keys(actionTypes).length) {
        addImport(
          path,
          [...Object.keys(actionTypes).map(camelCase)],
          targetPath
        );
      }
    }
  }
});
