const babelTemplate = require('@babel/template').default;

const buildDefaultExport = babelTemplate(`export default () => SFC`, {
  sourceType: 'module',
  plugins: ['dynamicImport', 'pluginJsx', 'pluginSyntaxObjectRestSpread']
});

module.exports = ({ types: t }) => ({
  name: 'holon-component-default-export',
  visitor: {
    Program(rootPath) {
      let defaultExportPath;
      rootPath.traverse({
        ExportDefaultDeclaration(path) {
          defaultExportPath = path;
        }
      });
      if (!defaultExportPath) {
        rootPath.pushContainer(
          'body',
          buildDefaultExport({
            SFC: t.jSXElement(
              t.jSXOpeningElement(t.jSXIdentifier('div'), []),
              t.jSXClosingElement(t.jSXIdentifier('div')),
              [
                t.jSXElement(
                  t.jSXOpeningElement(t.jSXIdentifier('h2'), [
                    t.jSXAttribute(
                      t.jSXIdentifier('className'),
                      t.stringLiteral('holon-component-title')
                    )
                  ]),
                  t.jSXClosingElement(t.jSXIdentifier('h2')),
                  []
                ),
                t.jSXElement(
                  t.jSXOpeningElement(t.jSXIdentifier('ul'), [
                    t.jSXAttribute(
                      t.jSXIdentifier('className'),
                      t.stringLiteral('holon-component-props')
                    )
                  ]),
                  t.jSXClosingElement(t.jSXIdentifier('ul')),
                  []
                )
              ]
            )
          })
        );
      }
    }
  }
});
