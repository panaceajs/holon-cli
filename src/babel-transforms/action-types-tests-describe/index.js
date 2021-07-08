const babelTemplate = require('@babel/template').default;

const buildDescribe = babelTemplate(`describe('action types', () => { });`, {
  sourceType: 'module',
  plugins: ['objectRestSpread']
});

module.exports = ({ types: t }) => ({
  name: 'holon-action-types-tests-describe',
  visitor: {
    Program(rootPath) {
      let defaultExportPath;
      rootPath.traverse({
        CallExpression(path) {
          const callee = path.get('callee');
          if (
            callee &&
            t.isIdentifier(callee) &&
            callee.get('name').node === 'describe'
          ) {
            defaultExportPath = path;
          }
        }
      });
      if (!defaultExportPath) {
        rootPath.pushContainer('body', buildDescribe());
      }
    }
  }
});
