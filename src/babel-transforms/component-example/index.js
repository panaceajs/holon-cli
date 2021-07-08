const { findExportedReactComponent, findParams } = require('../utils');
const camelCase = require('camel-case');

const findJSXElementByClass = className => ({
  JSXAttribute(path) {
    const {
      node: {
        name: { name: attributeName } = {},
        value: { value: attributeValue } = {}
      } = {}
    } = path;
    if (attributeName === 'className' && attributeValue === className) {
      // will return its opening element path
      this.elements.push(path.parentPath.parentPath);
    }
  }
});

module.exports = ({ types: t }) => ({
  name: 'holon-component-example',
  visitor: {
    Program(path, { opts: { componentName } }) {
      const headings = [];
      if (componentName) {
        path.traverse(findJSXElementByClass('holon-component-title'), {
          elements: headings
        });

        if (headings.length) {
          headings.forEach(headingPath => {
            if (headingPath.node && headingPath.node.children) {
              // eslint-disable-next-line
            headingPath.node.children = [t.jSXText(componentName)];
            }
          });
        }
      }

      const exportedReactComponent = findExportedReactComponent(path);

      if (exportedReactComponent) {
        const propsObjectPattern = findParams(exportedReactComponent);
        if (propsObjectPattern) {
          const { props, dispatchProps } = propsObjectPattern
            .get('properties')
            .reduce(
              (allProps, property) => {
                // console.log(property.node.key.name);
                if (t.isIdentifier(property.get('key'))) {
                  const key = property.get('key').get('name').node;
                  const value = property.get('value');
                  if (t.isIdentifier(value)) {
                    const valueName = value.get('name').node;
                    if (valueName === key && key !== 'classes') {
                      return { ...allProps, props: [...allProps.props, key] };
                    }
                    // { foo }
                  } else if (t.isAssignmentPattern(value)) {
                    const assignmentKey = value.get('left');
                    const assignmentValue = value.get('right');
                    if (t.isIdentifier(assignmentKey)) {
                      if (
                        t.isArrowFunctionExpression(assignmentValue) ||
                        t.isFunctionExpression(assignmentValue)
                      ) {
                        return {
                          ...allProps,
                          dispatchProps: [...allProps.dispatchProps, key]
                        };
                      } else if (t.isLiteral(assignmentValue)) {
                        return { ...allProps, props: [...allProps.props, key] };
                      }
                    }
                  }
                }

                return allProps;
              },
              { props: [], dispatchProps: [] }
            );

          const foundProps = [];
          path.traverse(findJSXElementByClass('holon-component-props'), {
            elements: foundProps
          });

          if (foundProps.length) {
            foundProps.forEach(foundPropsPath => {
              if (foundPropsPath.node && foundPropsPath.node.children) {
                // eslint-disable-next-line
              foundPropsPath.node.children = [];
                foundPropsPath.get('openingElement').set('selfClosing', false);

                foundPropsPath.set(
                  'closingElement',
                  t.jSXClosingElement(t.jSXIdentifier('ul'))
                );

                if (props.length) {
                  props.map(camelCase).forEach(prop => {
                    foundPropsPath.pushContainer(
                      'children',
                      t.jSXElement(
                        t.jSXOpeningElement(t.jSXIdentifier('li'), []),
                        t.jSXClosingElement(t.jSXIdentifier('li')),
                        [t.jSXText(`${prop}: {${prop}}`)]
                      )
                    );
                  });
                }
                if (dispatchProps.length) {
                  dispatchProps.map(camelCase).forEach(dispatchProp => {
                    foundPropsPath.pushContainer(
                      'children',
                      t.jSXElement(
                        t.jSXOpeningElement(t.jSXIdentifier('li'), []),
                        t.jSXClosingElement(t.jSXIdentifier('li')),
                        [
                          t.jSXElement(
                            t.jSXOpeningElement(t.jSXIdentifier('button'), [
                              t.jSXAttribute(
                                t.jSXIdentifier('type'),
                                t.stringLiteral('button')
                              ),
                              t.jSXAttribute(
                                t.jSXIdentifier('onClick'),
                                t.jSXExpressionContainer(
                                  t.arrowFunctionExpression(
                                    [],
                                    t.blockStatement([
                                      t.expressionStatement(
                                        t.callExpression(
                                          t.identifier(dispatchProp),
                                          []
                                        )
                                      )
                                    ])
                                  )
                                )
                              )
                            ]),
                            t.jSXClosingElement(t.jSXIdentifier('button')),
                            [t.jSXText(`${dispatchProp} action`)]
                          )
                        ]
                      )
                    );
                  });
                }
              }
            });
          }
        }
      }
    }
  }
});
