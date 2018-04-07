const babelTemplate = require('@babel/template').default;

const buildDescribe = babelTemplate(
  `describe('component', () => {

});`,
  {
    sourceType: 'module',
    plugins: ['dynamicImport', 'pluginJsx', 'pluginSyntaxObjectRestSpread']
  }
);

module.exports = ({ types: t }) => ({
  name: 'holon-component-tests-describe',
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
