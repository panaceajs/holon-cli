const babelTemplate = require('@babel/template').default;

const buildDefaultExport = babelTemplate(
  `export default connect()(COMPONENT);`,
  {
    sourceType: 'module',
    plugins: ['objectRestSpread']
  }
);

module.exports = ({ types: t }) => ({
  name: 'holon-container-default-export',
  visitor: {
    Program(rootPath, { opts: { componentName } }) {
      let defaultExportPath;
      rootPath.traverse({
        ExportDefaultDeclaration(path) {
          defaultExportPath = path;
        }
      });
      if (!defaultExportPath) {
        rootPath.pushContainer(
          'body',
          buildDefaultExport({ COMPONENT: t.identifier(componentName) })
        );
      }
    }
  }
});
