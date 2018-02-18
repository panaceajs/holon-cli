const babelTemplate = require('@babel/template').default;

const camelCase = require('camel-case');
const { findCallExpression } = require('../utils');

const collectactionCreatorsTests = {
  ExpressionStatement(path) {
    const {
      node: {
        expression: {
          callee: { name } = {},
          arguments: [{ value: itString } = {}] = []
        }
      } = {}
    } = path;
    if (name === 'it' && itString) {
      const [shouldSet, propName] = itString.split('`');
      if (shouldSet === 'should set ' && propName) {
        this.cache[propName] = path;
      }
    }
  }
};

const buildComponentTest = babelTemplate(
  `it(TEST_NAME, () => {
    EXAMPLE_VAR
    WRAPPER_VAR
    expect(wrapper).toMatchSnapshot();
  });
`,
  { sourceType: 'module' }
);

module.exports = ({ types: t }) => ({
  name: 'holon-component-tests',
  visitor: {
    Program(
      path,
      { opts: { name = 'ExampleComponent', props = [], dispatchProps = [] } }
    ) {
      // //------------------------------------------------------
      // add and remove imports
      const describeCallExpression = findCallExpression(path, 'describe');
      if (describeCallExpression) {
        const describeArrowFunctionExpression = describeCallExpression.get(
          'arguments.1'
        );

        if (describeArrowFunctionExpression) {
          const describeBlockStatement = describeArrowFunctionExpression.get(
            'body'
          );
          if (describeBlockStatement) {
            // add missing tests

            const cache = {};
            describeBlockStatement.traverse(collectactionCreatorsTests, {
              cache
            });

            const allProps = [...props, ...dispatchProps];
            allProps
              .filter(prop => !cache[prop])
              .map(camelCase)
              .forEach(prop => {
                const component = t.jSXElement(
                  t.jSXOpeningElement(t.jSXIdentifier(name), [
                    t.jSXAttribute(
                      t.jSXIdentifier(prop),
                      t.jSXExpressionContainer(t.identifier(`${prop}Value`))
                    )
                  ]),
                  t.jSXClosingElement(t.jSXIdentifier(name)),
                  []
                );

                const propTest = buildComponentTest({
                  TEST_NAME: t.stringLiteral(
                    `should set \`${prop}\` prop properly`
                  ),
                  EXAMPLE_VAR: t.VariableDeclaration('const', [
                    t.variableDeclarator(
                      t.identifier(`${prop}Value`),
                      props.indexOf(prop) !== -1
                        ? t.stringLiteral(`${prop} value`)
                        : t.functionExpression(
                            t.identifier(`${prop}Fn`),
                            [],
                            t.blockStatement([])
                          )
                    )
                  ]),
                  WRAPPER_VAR: t.variableDeclaration('const', [
                    t.variableDeclarator(
                      t.identifier('wrapper'),
                      t.callExpression(t.identifier('shallow'), [component])
                    )
                  ])
                });

                describeBlockStatement.pushContainer('body', propTest);
              });
          }
        }
      }
    }
  }
});
