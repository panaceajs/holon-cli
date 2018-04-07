const babelTemplate = require('@babel/template').default;

const buildDescribe = babelTemplate(
  `describe(DESCRIBE, () => {

});`,
  {
    sourceType: 'module',
    plugins: ['dynamicImport', 'pluginJsx', 'pluginSyntaxObjectRestSpread']
  }
);

module.exports = ({ types: t }) => ({
  name: 'holon-reducer-tests-describe',
  visitor: {
    Program(
      rootPath,
      { opts: { stateNamespace = 'ExampleComponent', actionTypes = {} } }
    ) {
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
        rootPath.pushContainer(
          'body',
          buildDescribe({
            DESCRIBE: `'\`${stateNamespace}\` reducer'`
          })
        );
      }
    }
  }
});
