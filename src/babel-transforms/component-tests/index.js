const babelTemplate = require('@babel/template').default;
const types = require('@babel/types');

const camelCase = require('camel-case');
const { findCallExpression } = require('../utils');

const collectDefaultTest = {
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
      if (itString === 'should render properly') {
        this.cache.defaultTest = true;
      }
    }
  }
};
const collectPropTests = {
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

const createPropTest = ({ name, props, prop }) => {
  const component = types.jSXElement(
    types.jSXOpeningElement(
      types.jSXIdentifier(name),
      prop
        ? [
            types.jSXAttribute(
              types.jSXIdentifier(prop),
              types.jSXExpressionContainer(types.identifier(`${prop}Value`))
            )
          ]
        : []
    ),
    types.jSXClosingElement(types.jSXIdentifier(name)),
    []
  );

  return buildComponentTest({
    TEST_NAME: types.stringLiteral(
      prop ? `should set \`${prop}\` prop properly` : `should render properly`
    ),
    EXAMPLE_VAR: prop
      ? types.VariableDeclaration('const', [
          types.variableDeclarator(
            types.identifier(`${prop}Value`),
            props.indexOf(prop) !== -1
              ? types.stringLiteral(`${prop} value`)
              : types.arrowFunctionExpression([], types.blockStatement([]))
          )
        ])
      : undefined,
    WRAPPER_VAR: types.variableDeclaration('const', [
      types.variableDeclarator(
        types.identifier('wrapper'),
        types.callExpression(types.identifier('shallow'), [component])
      )
    ])
  });
};

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
        const describeDescription = describeCallExpression.get('arguments.0');
        if (
          describeDescription &&
          describeDescription.get('value') &&
          describeDescription.get('value').node === 'component'
        ) {
          describeDescription.set('value', `\`${name}\` component`);
        }
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

            describeBlockStatement.traverse(collectDefaultTest, {
              cache
            });

            if (!cache.defaultTest) {
              describeBlockStatement.pushContainer(
                'body',
                createPropTest({ name, props })
              );
            }

            describeBlockStatement.traverse(collectPropTests, {
              cache
            });

            const allProps = [...props, ...dispatchProps];
            allProps
              .filter(prop => !cache[prop])
              .map(camelCase)
              .forEach(prop => {
                describeBlockStatement.pushContainer(
                  'body',
                  createPropTest({ name, props, prop })
                );
              });
          }
        }
      }
    }
  }
});
