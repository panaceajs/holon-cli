const babelTemplate = require('@babel/template').default;
const upperCaseFirst = require('upper-case-first');
const camelCase = require('camel-case');

const buildDefaultExport = babelTemplate(
  `const COMPONENT_NAME = () => SFC;
function * exampleSaga () {
  yield takeEvery('ACTION_1', function * anotherExampleSaga ({ payload }) {
    yield put({ type: 'ACTION_2', payload })
  });
}
export default boundWithRedux(OPTIONS)(COMPONENT_NAME);`,
  {
    sourceType: 'module',
    plugins: ['objectRestSpread']
  }
);

module.exports = ({ types: t }) => ({
  name: 'holon-nextjs-page-default-export',
  visitor: {
    Program(
      rootPath,
      { opts: { stateNamespace, magic, withReducer, actionTypes } }
    ) {
      const componentName = upperCaseFirst(camelCase(stateNamespace));
      let defaultExportPath;
      rootPath.traverse({
        ExportDefaultDeclaration(path) {
          defaultExportPath = path;
        }
      });

      if (!defaultExportPath) {
        const options = [
          t.objectProperty(
            t.identifier('stateNamespace'),
            t.stringLiteral(stateNamespace)
          )
        ];
        if (magic || withReducer) {
          options.push(
            t.objectProperty(t.identifier('reducer'), t.identifier('reducer'))
          );

          options.push(
            t.objectProperty(t.identifier('saga'), t.identifier('exampleSaga'))
          );
        }
        rootPath.pushContainer(
          'body',
          buildDefaultExport({
            SFC: t.jSXElement(
              t.jSXOpeningElement(t.jSXIdentifier('Page'), []),
              t.jSXClosingElement(t.jSXIdentifier('Page')),
              [
                t.jSXElement(
                  t.jSXOpeningElement(t.jSXIdentifier('Section'), []),
                  t.jSXClosingElement(t.jSXIdentifier('Section')),
                  [
                    t.jSXElement(
                      t.jSXOpeningElement(t.jSXIdentifier('Heading1'), []),
                      t.jSXClosingElement(t.jSXIdentifier('Heading1')),
                      [t.jSXText(`\`${stateNamespace}\` page`)]
                    ),
                    t.jSXElement(
                      t.jSXOpeningElement(t.jSXIdentifier('Paragraph'), []),
                      t.jSXClosingElement(t.jSXIdentifier('Paragraph')),
                      [
                        t.jSXText(
                          `Est architecto dolores harum sequi suscipit mollitia.`
                        )
                      ]
                    )
                  ]
                )
              ]
            ),
            ACTION_1: t.stringLiteral('PUT_A_REAL_ACTION_TYPE_HERE'),
            ACTION_2: t.stringLiteral('PUT_ANOTHER_REAL_ACTION_TYPE_HERE'),
            OPTIONS: t.objectExpression(options),
            COMPONENT_NAME: t.identifier(componentName)
          })
        );
      }
    }
  }
});
