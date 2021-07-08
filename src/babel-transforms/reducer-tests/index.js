const babelTemplate = require('@babel/template').default;
const constantCase = require('constant-case');
const camelCase = require('camel-case');

const collectActionTests = {
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
      const [shouldExport, actionName] = itString.split('`');
      if (shouldExport === 'should handle ' && actionName) {
        this.cache[actionName] = path;
      }
    }
  }
};

const buildActionTest = babelTemplate(
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
  name: 'holon-reducer-tests',
  visitor: {
    CallExpression(path, { opts: { actionTypes, stateNamespace = 'root' } }) {
      const {
        node: {
          callee: { name: calleeName } = {},
          arguments: [{ value: describeName } = {}] = []
        } = {}
      } = path;
      if (calleeName === 'describe' && describeName.indexOf('reducer') !== -1) {
        const cache = {};
        path.traverse(collectActionTests, { cache });
        // eslint-disable-next-line
        path.node.arguments[0] = t.stringLiteral(
          `\`${stateNamespace}\` reducer`
        );

        if (Object.keys(actionTypes).length) {
          const arrowFunctionExpression = path.get('arguments.1');
          if (t.isArrowFunctionExpression(arrowFunctionExpression)) {
            const blockStatement = arrowFunctionExpression.get('body');
            if (t.isBlockStatement(blockStatement)) {
              Object.keys(actionTypes)
                .filter(actionType => !cache[constantCase(actionType)])
                .forEach(actionType => {
                  const actionCreatorTest = buildActionTest({
                    ACTION_CREATOR: t.identifier(camelCase(actionType)),
                    TEST_NAME: t.stringLiteral(
                      `should handle \`${constantCase(actionType)}\``
                    ),
                    PAYLOAD: t.stringLiteral(
                      `${constantCase(actionType)
                        .toLowerCase()
                        .replace('_', '-')}-unit-test-payload`
                    )
                  });
                  blockStatement.pushContainer('body', actionCreatorTest);
                });
            }
          }
        }
      }
    }
  }
});
