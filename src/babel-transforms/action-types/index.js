const babelTemplate = require('@babel/template').default;
const constantCase = require('constant-case');

const collectExports = {
  ExportNamedDeclaration(path) {
    this.cache[path.node.declaration.declarations[0].id.name] = path;
  }
};

module.exports = ({ types: t }) => ({
  name: 'holon-action-types',
  visitor: {
    Program(path, { opts: { actionTypes = {} } }) {
      const cache = {};
      path.traverse(collectExports, { cache });
      const buildActionTypeExport = babelTemplate(
        `export const EXPORT_NAME = CONST_VALUE;`,
        { sourceType: 'module' }
      );

      const namedExportPaths = Object.values(cache);
      const lastNamedExportPath = namedExportPaths[namedExportPaths.length - 1];
      Object.keys(actionTypes)
        .filter(actionType => !cache[constantCase(actionType)])
        .forEach(actionType => {
          const actionTypeExport = buildActionTypeExport({
            EXPORT_NAME: t.identifier(constantCase(actionType)),
            CONST_VALUE: t.stringLiteral(constantCase(actionType))
          });
          if (lastNamedExportPath) {
            lastNamedExportPath.insertAfter(actionTypeExport);
          } else {
            path.unshiftContainer('body', actionTypeExport);
          }
        });
    }
  }
});
