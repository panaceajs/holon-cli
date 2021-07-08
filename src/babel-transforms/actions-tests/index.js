const babelTemplate = require('@babel/template').default;
const constantCase = require('constant-case');
const camelCase = require('camel-case');

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
      const [shouldExport, actionCreatorName] = itString.split('`');
      if (shouldExport === 'should export ' && actionCreatorName) {
        this.cache[actionCreatorName] = path;
      }
    }
  }
};

const buildActionCreatorTest = babelTemplate(
  `it(TEST_NAME, () => {
    expect(ACTION_CREATOR).toBeDefined();
    expect(ACTION_CREATOR()).toEqual({
      type: ACTION_TYPE
    });
  });

`,
  { sourceType: 'module' }
);

module.exports = ({ types: t }) => ({
  name: 'holon-action-creator-tests',
  visitor: {
    CallExpression(
      path,
      { opts: { actionTypes = {}, stateNamespace = 'root' } }
    ) {
      const {
        node: {
          callee: { name: calleeName } = {},
          arguments: [{ value: describeName } = {}] = []
        } = {}
      } = path;
      if (
        calleeName === 'describe' &&
        describeName.indexOf('action creators') !== -1
      ) {
        const cache = {};
        path.traverse(collectactionCreatorsTests, { cache });
        // eslint-disable-next-line
        path.node.arguments[0] = t.stringLiteral(
          `\`${stateNamespace}\` action creators`
        );

        const arrowFunctionExpression = path.get('arguments.1');
        if (t.isArrowFunctionExpression(arrowFunctionExpression)) {
          const blockStatement = arrowFunctionExpression.get('body');
          if (t.isBlockStatement(blockStatement)) {
            Object.keys(actionTypes)
              .filter(actionType => !cache[camelCase(actionType)])
              .forEach(actionType => {
                const actionCreatorTest = buildActionCreatorTest({
                  ACTION_CREATOR: t.identifier(camelCase(actionType)),
                  TEST_NAME: t.stringLiteral(
                    `should export \`${camelCase(actionType)}\` function`
                  ),
                  ACTION_TYPE: t.identifier(constantCase(actionType))
                });
                blockStatement.pushContainer('body', actionCreatorTest);
              });
          }
        }
      }
    }
  }
});
