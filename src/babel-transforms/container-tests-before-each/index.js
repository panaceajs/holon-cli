const babelTemplate = require('@babel/template').default;
const types = require('@babel/types');

const camelCase = require('camel-case');
const { findCallExpression } = require('../utils');
const { findVariableDeclarator } = require('../utils/variables');
const { findAssignmentExpression } = require('../utils/expressions');

const collectTests = path => {
  const results = {};
  path.traverse({
    ExpressionStatement(innerPath) {
      const {
        node: {
          expression: {
            callee: { name } = {},
            arguments: [{ value: itString } = {}] = []
          }
        } = {}
      } = innerPath;
      if (name === 'it' && itString) {
        const [shouldSet, propName] = itString.split('`');
        if (shouldSet === 'should set ' && propName) {
          results[propName] = path;
        }
      }
    }
  });

  return results;
};

const buildLetStoreVariableDeclaration = babelTemplate(`let store;`, {
  sourceType: 'module'
});

const buildBeforeEach = babelTemplate(`beforeEach(() => {});`, {
  sourceType: 'module'
});

const buildMockStoreVariableDeclaration = babelTemplate(
  `const mockStore = configureStore();`,
  {
    sourceType: 'module'
  }
);

const buildInitialStateVariableDeclaration = babelTemplate(
  `const initialState = {};`,
  {
    sourceType: 'module'
  }
);

const buildStoreAssignment = babelTemplate(`store = mockStore(initialState);`, {
  sourceType: 'module'
});

const buildStoreDispatchAssignment = babelTemplate(
  `store.dispatch = jest.fn();`,
  {
    sourceType: 'module'
  }
);

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
  name: 'holon-container-tests-before-each',
  visitor: {
    Program(
      path,
      { opts: { name = 'ExampleComponent', props = [], dispatchProps = [] } }
    ) {
      // //------------------------------------------------------
      // add and remove imports
      const describeCallExpression = findCallExpression(path, 'describe');
      if (describeCallExpression) {
        if (
          describeCallExpression
            .get('arguments.1')
            .isArrowFunctionExpression() &&
          describeCallExpression.get('arguments.1.body').isBlockStatement()
        ) {
          //
          const describeBlockStatement = describeCallExpression.get(
            'arguments.1.body'
          );

          let [beforeEachExpressionStatement] = describeBlockStatement
            .get('body')
            .filter(
              item =>
                item.isExpressionStatement() &&
                item.get('expression.callee.name').node === 'beforeEach'
            );

          if (!beforeEachExpressionStatement) {
            describeBlockStatement.unshiftContainer('body', buildBeforeEach());
            beforeEachExpressionStatement = describeBlockStatement.get(
              'body.0'
            );
          }

          // ///////////////////////////////////////
          // let store;
          const [letStoreDeclaration] = findVariableDeclarator(path, {
            kind: 'let',
            name: 'store'
          });

          if (!letStoreDeclaration) {
            describeBlockStatement.unshiftContainer(
              'body',
              buildLetStoreVariableDeclaration()
            );
          }

          // const mockStore = configureStore();
          const [constMockStoreDeclaration] = findVariableDeclarator(path, {
            name: 'mockStore'
          });

          if (!constMockStoreDeclaration) {
            beforeEachExpressionStatement
              .get('expression.arguments.0.body')
              .pushContainer('body', buildMockStoreVariableDeclaration());
          }

          // const initialState = {};
          const [constInitialStateDeclaration] = findVariableDeclarator(path, {
            name: 'initialState'
          });

          if (!constInitialStateDeclaration) {
            beforeEachExpressionStatement
              .get('expression.arguments.0.body')
              .pushContainer('body', buildInitialStateVariableDeclaration());
          }

          // store = mockStore(initialState);
          const [storeAssignmentExpressionStatement] = findAssignmentExpression(
            path,
            {
              name: 'store'
            }
          );

          if (!storeAssignmentExpressionStatement) {
            beforeEachExpressionStatement
              .get('expression.arguments.0.body')
              .pushContainer('body', buildStoreAssignment());
          }

          // store.dispatch = jest.fn();
          const [
            storeDispatchAssignmentExpressionStatement
          ] = findAssignmentExpression(path, {
            object: 'store',
            property: 'dispatch'
          });

          if (!storeDispatchAssignmentExpressionStatement) {
            beforeEachExpressionStatement
              .get('expression.arguments.0.body')
              .pushContainer('body', buildStoreDispatchAssignment());
          }
        }
      }
    }
  }
});
