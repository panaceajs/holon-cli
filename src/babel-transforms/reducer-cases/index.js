const babelTemplate = require('@babel/template').default;
const constantCase = require('constant-case');

const collectSwitchCaseStatements = {
  SwitchCase(path) {
    const { node: { test } = {} } = path;
    this.cache[test ? test.name : 'default'] = path;
  }
};

const buildTest = babelTemplate(`ACTION_TYPE`, {
  sourceType: 'module',
  plugins: ['objectRestSpread']
});

const buildConsequent = babelTemplate(`{ return { ...state } }`, {
  sourceType: 'module',
  plugins: ['objectRestSpread']
});

module.exports = ({ types: t }) => ({
  name: 'holon-reducer-cases',
  visitor: {
    Program(rootPath, { opts: { actionTypes = {} } }) {
      rootPath.traverse({
        SwitchStatement(path) {
          // complete imports

          const cache = {};
          path.traverse(collectSwitchCaseStatements, { cache });

          const switchCaseStatements = Object.values(cache);

          Object.keys(actionTypes)
            .filter(actionType => !cache[constantCase(actionType)])
            .forEach(actionType => {
              const test = buildTest({
                ACTION_TYPE: t.identifier(constantCase(actionType))
              });

              const consequent = buildConsequent();

              consequent.body[0].argument.properties = [
                ...consequent.body[0].argument.properties,
                t.objectProperty(
                  t.identifier(actionTypes[actionType] || actionType),
                  t.logicalExpression(
                    '||',
                    t.identifier('payload'),
                    t.stringLiteral(
                      `${actionTypes[actionType] || actionType}-value`
                    )
                  )
                ),
                t.objectProperty(
                  t.identifier('error'),
                  t.identifier('error'),
                  false,
                  true
                )
              ];
              const switchCaseStatement = t.switchCase(test.expression, [
                consequent
              ]);
              if (switchCaseStatements.length) {
                switchCaseStatements[
                  switchCaseStatements.length - 1
                ].insertBefore(switchCaseStatement);
              } else {
                path.unshiftContainer('cases', switchCaseStatement);
              }
            });
        }
      });
    }
  }
});
