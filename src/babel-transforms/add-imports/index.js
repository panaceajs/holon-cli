const { addImport } = require('../utils/import');

module.exports = () => ({
  name: 'holon-add-import',
  visitor: {
    Program(path, { opts: { imports = {} } }) {
      Object.keys(imports).forEach(sourcePath => {
        const exported = imports[sourcePath];
        if (exported.length || exported === undefined) {
          addImport(path, exported, sourcePath);
        }
      });
    }
  }
});
