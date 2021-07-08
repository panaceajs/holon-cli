const babelTemplate = require('@babel/template').default;
const constantCase = require('constant-case');

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
      const [shouldExport, actionTypeName] = itString.split('`');
      if (shouldExport === 'should export ' && actionTypeName) {
        this.cache[actionTypeName] = path;
      }
    }
  }
};

const buildActionTypeTest = babelTemplate(
  `it(TEST_NAME, () => {
    expect(ACTION_TYPE).toBe(ACTION_TYPE_NAME);
  });
`,
  { sourceType: 'module' }
);

module.exports = ({ types: t }) => ({
  name: 'holon-action-types-tests',
  visitor: {
    CallExpression(path, { opts: { actionTypes, stateNamespace = 'root' } }) {
      const {
        node: {
          callee: { name: calleeName } = {},
          arguments: [{ value: describeName } = {}] = []
        } = {}
      } = path;
      if (
        calleeName === 'describe' &&
        describeName.indexOf('action types') !== -1
      ) {
        const cache = {};
        path.traverse(collectactionCreatorsTests, { cache });
        // eslint-disable-next-line
        path.node.arguments[0] = t.stringLiteral(
          `\`${stateNamespace}\` action types`
        );

        const arrowFunctionExpression = path.get('arguments.1');
        if (t.isArrowFunctionExpression(arrowFunctionExpression)) {
          const blockStatement = arrowFunctionExpression.get('body');
          if (t.isBlockStatement(blockStatement)) {
            Object.keys(actionTypes)
              .filter(actionType => !cache[constantCase(actionType)])
              .forEach(actionType => {
                const actionTypeTest = buildActionTypeTest({
                  TEST_NAME: t.stringLiteral(
                    `should export \`${constantCase(actionType)}\` type`
                  ),
                  ACTION_TYPE: t.identifier(constantCase(actionType)),
                  ACTION_TYPE_NAME: t.stringLiteral(constantCase(actionType))
                });
                blockStatement.pushContainer('body', actionTypeTest);
              });
          }
        }
      }
    }
  }
});
