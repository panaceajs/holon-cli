const babelTemplate = require('@babel/template').default;

const buildReturnDefaultStateTest = babelTemplate(
  `it('should return default state', () => {
    const next = reducer(undefined, { type: 'UNKNOWN_TYPE' });
    expect(next).toMatchSnapshot();
  });
`,
  { sourceType: 'module' }
);

module.exports = ({ types: t }) => ({
  name: 'holon-reducer-tests-initial-state',
  visitor: {
    CallExpression(path) {
      if (
        t.isIdentifier(path.get('callee').node, { name: 'describe' }) &&
        path.get('arguments.1') &&
        t.isArrowFunctionExpression(path.get('arguments.1').node)
      ) {
        const arrowFunctionExpressionPath = path.get('arguments.1');
        const blockStatement = arrowFunctionExpressionPath.get('body');

        let foundTest;
        arrowFunctionExpressionPath.traverse({
          CallExpression(innerPath) {
            if (
              t.isIdentifier(innerPath.get('callee').node, { name: 'it' }) &&
              innerPath.get('arguments.0') &&
              t.isStringLiteral(innerPath.get('arguments.0').node)
            ) {
              const testName = innerPath.get('arguments.0.value').node;

              if (testName === 'should return default state') {
                foundTest = true;
              }
            }
          }
        });

        if (!foundTest) {
          blockStatement.pushContainer(
            'body',
            buildReturnDefaultStateTest({ UNKNOWN_TYPE: 'UNKNOWN_TYPE' })
          );
        }
      }
    }
  }
});
