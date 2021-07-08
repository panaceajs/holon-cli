const babelTemplate = require('@babel/template').default;
const constantCase = require('constant-case');
const camelCase = require('camel-case');

const collectActionCreators = {
  VariableDeclaration(path) {
    if (
      path.node.kind === 'const' &&
      path.node.declarations &&
      path.node.declarations.length &&
      path.node.declarations[0] &&
      path.node.declarations[0].init &&
      path.node.declarations[0].init.callee &&
      path.node.declarations[0].init.callee.name === 'createAction' &&
      path.node.declarations[0].init.arguments &&
      path.node.declarations[0].init.arguments.length &&
      path.node.declarations[0].init.arguments[0].name
    ) {
      this.cache[path.node.declarations[0].init.arguments[0].name] = path;
    }
  }
};

const buildActionCreator = babelTemplate(
  `export const EXPORT_NAME = createAction(CONST_VALUE);`,
  { sourceType: 'module' }
);

module.exports = ({ types: t }) => ({
  name: 'holon-action-creators',
  visitor: {
    Program(path, { opts: { actionTypes = {} } }) {
      const cache = {};
      path.traverse(collectActionCreators, { cache, actionTypes });

      Object.keys(actionTypes)
        .filter(actionType => !cache[constantCase(actionType)])
        .forEach(actionType => {
          const actionCreator = buildActionCreator({
            EXPORT_NAME: t.identifier(camelCase(actionType)),
            CONST_VALUE: t.identifier(constantCase(actionType))
          });

          path.pushContainer('body', actionCreator);
        });
    }
  }
});
