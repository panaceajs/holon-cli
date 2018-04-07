const babelTemplate = require('@babel/template').default;
const camelCase = require('camel-case');

const buildContainerDispatchTest = babelTemplate(
  `it(TEST_NAME, () => {
    const next = reducer(undefined, ACTION_CREATOR());
    expect(next).toMatchSnapshot();
    const next2 = reducer(next, ACTION_CREATOR(PAYLOAD));
expect(next2).toMatchSnapshot();
  });
`,
  { sourceType: 'module' }
);

module.exports = ({ types: t }) => ({
  name: 'holon-reducer-tests-cases',
  visitor: {
    CallExpression(path, { opts: { actionTypes = {} } }) {
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
              const actionType = testName
                .replace('should handle `', '')
                .replace('`', '');
              console.log(actionType);
              if (actionType) {
                cache[actionType] = innerPath;
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
                TEST_NAME: t.stringLiteral(`should handle \`${actionName}\``),
                ACTION_CREATOR: t.identifier(camelCase(actionName)),
                PAYLOAD: t.stringLiteral(
                  `${camelCase(`${actionName}-payload`)}`
                )
              })
            );
          });
      }
    }
  }
});
