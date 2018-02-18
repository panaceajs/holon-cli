const babelTemplate = require('@babel/template').default;
const types = require('@babel/types');

const camelCase = require('camel-case');
const {
  findCallExpression,
  findCallExpressions,
  findVariableDeclaration,
  findAssignmentExpression
} = require('../utils');
const { addImport, removeImport } = require('../utils/import');

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
const buildLetMount = babelTemplate(`let mount;`, { sourceType: 'module' });
const buildBeforeEach = babelTemplate(`beforeEach(() => { });`, {
  sourceType: 'module'
});
const buildMountIsCreateMount = babelTemplate(`mount = createMount();`, {
  sourceType: 'module'
});

module.exports = ({ types: t }) => ({
  name: 'holon-component-tests',
  visitor: {
    Program(
      path,
      {
        opts: {
          name = 'ExampleComponent',
          props = [],
          dispatchProps = [],
          withStyles,
          themePath = 'shared/themes'
        }
      }
    ) {
      // //------------------------------------------------------
      // add and remove imports
      const describeCallExpression = findCallExpression(path, 'describe');
      if (describeCallExpression) {
        if (withStyles) {
          addImport(path, ['createMount'], 'material-ui/test-utils');
          addImport(
            path,
            [{ default: 'MuiThemeProvider' }],
            'material-ui/styles/MuiThemeProvider'
          );
          addImport(path, [{ default: 'theme' }], themePath);
          //
          removeImport(path, ['shallow'], 'enzyme');
        } else {
          addImport(path, ['shallow'], 'enzyme');
          removeImport(path, ['createMount'], 'material-ui/test-utils');
          removeImport(
            path,
            [{ default: 'MuiThemeProvider' }],
            'material-ui/styles/MuiThemeProvider'
          );
          removeImport(path, [{ default: 'theme' }], themePath);
        }
        const describeArrowFunctionExpression = describeCallExpression.get(
          'arguments.1'
        );

        if (describeArrowFunctionExpression) {
          if (describeArrowFunctionExpression) {
            const describeBlockStatement = describeArrowFunctionExpression.get(
              'body'
            );
            if (describeBlockStatement) {
              // add missing tests

              const cache = {};
              describeBlockStatement.traverse(collectactionCreatorsTests, {
                cache
              });

              const allProps = [...props, ...dispatchProps];
              allProps
                .filter(prop => !cache[prop])
                .map(camelCase)
                .forEach(prop => {
                  const component = t.jSXElement(
                    t.jSXOpeningElement(t.jSXIdentifier(name), [
                      t.jSXAttribute(
                        t.jSXIdentifier(prop),
                        t.jSXExpressionContainer(t.identifier(`${prop}Value`))
                      )
                    ]),
                    t.jSXClosingElement(t.jSXIdentifier(name)),
                    []
                  );

                  const propTest = buildComponentTest({
                    TEST_NAME: t.stringLiteral(
                      `should set \`${prop}\` prop properly`
                    ),
                    EXAMPLE_VAR: t.VariableDeclaration('const', [
                      t.variableDeclarator(
                        t.identifier(`${prop}Value`),
                        props.indexOf(prop) !== -1
                          ? t.stringLiteral(`${prop} value`)
                          : t.functionExpression(
                              t.identifier(`${prop}Fn`),
                              [],
                              t.blockStatement([])
                            )
                      )
                    ]),
                    WRAPPER_VAR: t.variableDeclaration('const', [
                      t.variableDeclarator(
                        t.identifier('wrapper'),
                        t.callExpression(t.identifier('shallow'), [
                          component,
                          t.objectExpression([
                            t.objectProperty(
                              t.identifier('dive'),
                              t.booleanLiteral(true)
                            )
                          ])
                        ])
                      )
                    ])
                  });

                  describeBlockStatement.pushContainer('body', propTest);
                });

              if (withStyles) {
                // replace all shallow calls with mount calls
                const shallows = findCallExpressions(path, 'shallow');
                shallows.forEach(callExpression => {
                  // replace shallow with mount
                  callExpression.set('callee', t.identifier('mount'));

                  // remove dive prop
                  if (
                    types.isObjectExpression(callExpression.get('arguments.1'))
                  ) {
                    const options = callExpression.get('arguments.1');
                    options.get('properties').forEach(property => {
                      if (property.get('key.name').node === 'dive') {
                        property.remove();
                      }
                    });

                    if (options.get('properties').length === 0) {
                      options.remove();
                    }
                  }

                  const jsxElement = callExpression.get('arguments.0');

                  if (
                    jsxElement &&
                    types.isJSXElement(jsxElement) &&
                    jsxElement.get('openingElement.name') &&
                    jsxElement.get('openingElement.name.name') &&
                    jsxElement.get('openingElement.name.name').node !==
                      'MuiThemeProvider'
                  ) {
                    callExpression.node.arguments.shift();

                    callExpression.node.arguments.unshift(
                      t.jSXElement(
                        t.jSXOpeningElement(
                          t.jSXIdentifier('MuiThemeProvider'),
                          [
                            t.jSXAttribute(
                              t.jSXIdentifier('theme'),
                              t.jSXExpressionContainer(t.identifier('theme'))
                            )
                          ]
                        ),
                        t.jSXClosingElement(
                          t.jSXIdentifier('MuiThemeProvider')
                        ),
                        [jsxElement.node]
                      )
                    );
                  }
                });

                // let mount
                if (describeCallExpression) {
                  // let mount
                  let letMountDeclaration = findVariableDeclaration(
                    describeCallExpression,
                    'mount'
                  );
                  if (!letMountDeclaration) {
                    // not found, let's add it

                    // added let mount;
                    describeBlockStatement.unshiftContainer(
                      'body',
                      buildLetMount()
                    );
                  }

                  letMountDeclaration = findVariableDeclaration(
                    describeCallExpression,
                    'mount'
                  );

                  // beforEach(() => { mount = createMount() });
                  const mountIsCreateMountCall = findAssignmentExpression(
                    describeCallExpression,
                    (left, right) =>
                      left &&
                      right &&
                      types.isIdentifier(left) &&
                      types.isCallExpression(right) &&
                      left.get('name').node === 'mount' &&
                      right.get('callee.name') &&
                      right.get('callee.name').node === 'createMount'
                  );

                  if (!mountIsCreateMountCall) {
                    // is there a beforeEach call?

                    let beforeEachCall = findCallExpression(
                      describeCallExpression,
                      'beforeEach'
                    );
                    if (!beforeEachCall) {
                      letMountDeclaration.insertAfter(buildBeforeEach());

                      beforeEachCall = findCallExpression(
                        describeCallExpression,
                        'beforeEach'
                      );
                    }

                    if (
                      beforeEachCall.get('arguments.0') &&
                      types.isBlockStatement(
                        beforeEachCall.get('arguments.0.body')
                      )
                    ) {
                      beforeEachCall
                        .get('arguments.0.body')
                        .unshiftContainer('body', buildMountIsCreateMount());
                    }
                  }
                }
              } else {
                // without styles
                // replace all mount calls with shallow calls
                const mounts = findCallExpressions(path, 'mount');
                mounts.forEach(callExpression => {
                  let options = callExpression.get('arguments.1');
                  if (!options) {
                    callExpression.pushContainer(
                      'arguments',
                      t.objectPattern([])
                    );
                    options = callExpression.get('arguments.1');
                  }

                  const diveProperty = options
                    .get('properties')
                    .reduce((found, property) => {
                      if (property.get('key.name').node === 'dive') {
                        return property;
                      }
                      return found;
                    }, undefined);

                  if (!diveProperty) {
                    options.pushContainer(
                      'properties',
                      t.objectProperty(
                        t.identifier('dive'),
                        t.booleanLiteral(true)
                      )
                    );
                  }
                  callExpression.set('callee', t.identifier('shallow'));

                  // get rid of MuiThemeProvider component
                  const jsxElement = callExpression.get('arguments.0');
                  if (
                    jsxElement &&
                    types.isJSXElement(jsxElement) &&
                    jsxElement.get('openingElement.name') &&
                    jsxElement.get('openingElement.name.name') &&
                    jsxElement.get('openingElement.name.name').node ===
                      'MuiThemeProvider'
                  ) {
                    const firstJSXElement = jsxElement
                      .get('children')
                      .reduce((found, child) => {
                        if (!found && types.isJSXElement(child)) {
                          return child;
                        }
                        return found;
                      }, undefined);
                    if (firstJSXElement) {
                      jsxElement.remove();
                      callExpression.unshiftContainer(
                        'arguments',
                        firstJSXElement.node
                      );
                    }
                  }
                });

                const letMountDeclaration = findVariableDeclaration(
                  describeCallExpression,
                  'mount'
                );

                if (letMountDeclaration) {
                  // let's remove it
                  letMountDeclaration.remove();

                  // beforEach(() => { mount = createMount() });
                  const mountIsCreateMountCall = findAssignmentExpression(
                    describeCallExpression,
                    (left, right) =>
                      left &&
                      right &&
                      types.isIdentifier(left) &&
                      types.isCallExpression(right) &&
                      left.get('name').node === 'mount' &&
                      right.get('callee.name') &&
                      right.get('callee.name').node === 'createMount'
                  );

                  if (mountIsCreateMountCall) {
                    const blockStatement = mountIsCreateMountCall.findParent(
                      p => types.isBlockStatement(p)
                    );

                    mountIsCreateMountCall.remove();

                    if (
                      blockStatement &&
                      blockStatement.get('body').length === 0
                    ) {
                      blockStatement
                        .findParent(p => types.isCallExpression(p))
                        .remove();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});
