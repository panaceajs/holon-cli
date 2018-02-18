const babelTemplate = require('@babel/template').default;
const camelCase = require('camel-case');
const constantCase = require('constant-case');

const buildContainerDispatchTest = babelTemplate(
  `it(TEST_NAME, () => {
    const EXAMPLE_VAR = EXAMPLE_VAR_VALUE;
    const wrapper = shallow(COMPONENT);
    wrapper.props().MEMBER(ARGUMENT);
    expect(store.dispatch).toHaveBeenCalledWith(CALL_EXPRESSION);
  });
`,
  { sourceType: 'module' }
);

module.exports = ({ types: t }) => ({
  name: 'holon-container-dispatch-tests',
  visitor: {
    CallExpression(
      path,
      { opts: { componentName = 'ExampleComponent', actionTypes = {} } }
    ) {
      if (
        t.isIdentifier(path.get('callee').node, { name: 'describe' }) &&
        path.get('arguments.1') &&
        t.isArrowFunctionExpression(path.get('arguments.1').node)
      ) {
        const arrowFunctionExpressionPath = path.get('arguments.1');
        const blockStatement = arrowFunctionExpressionPath.get('body');
        const cache = {};
        arrowFunctionExpressionPath.traverse({
          CallExpression(innerPath) {
            if (
              t.isIdentifier(innerPath.get('callee').node, { name: 'it' }) &&
              innerPath.get('arguments.0') &&
              t.isStringLiteral(innerPath.get('arguments.0').node)
            ) {
              const testName = innerPath.get('arguments.0.value').node;
              const [action, actionType] = testName
                .replace('maps `', '')
                .replace(' to dispatch ', '')
                .replace('` action.', '')
                .split('``');

              if (action && actionType && action === camelCase(actionType)) {
                cache[action] = innerPath;
              }
            }
          }
        });

        Object.keys(actionTypes)
          .filter(actionName => !cache[actionName])
          .forEach(actionName => {
            blockStatement.pushContainer(
              'body',
              buildContainerDispatchTest({
                TEST_NAME: t.stringLiteral(
                  `maps \`${actionName}\` to dispatch \`${constantCase(
                    actionName
                  )}\` action.`
                ),
                EXAMPLE_VAR: t.identifier(`${actionName}Value`),
                EXAMPLE_VAR_VALUE: t.stringLiteral(`${actionName}Value`),
                COMPONENT: t.jSXElement(
                  t.jSXOpeningElement(
                    t.jSXIdentifier(componentName),
                    [
                      t.jSXAttribute(
                        t.jSXIdentifier('store'),
                        t.jSXExpressionContainer(t.identifier('store'))
                      )
                    ],
                    true
                  ),
                  null,
                  []
                ),
                CALL_EXPRESSION: t.callExpression(t.identifier(actionName), [
                  t.identifier(`${actionName}Value`)
                ]),
                MEMBER: t.identifier(actionName),
                ARGUMENT: t.identifier(`${actionName}Value`)
              })
            );
          });
      }
    }
  }
});
