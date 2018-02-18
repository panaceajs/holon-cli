const { findExportedReactComponent, findOrCreateParams } = require('../utils');
const camelCase = require('camel-case');

module.exports = ({ types: t }) => ({
  name: 'holon-complete-props',
  visitor: {
    Program(path, { opts: { props = [], dispatchProps = [] } }) {
      /*
        export default () => <div>text</div>
      */

      if (props.length || dispatchProps.length) {
        const exportedReactComponent = findExportedReactComponent(path);

        if (exportedReactComponent) {
          const propsObjectPattern = findOrCreateParams(exportedReactComponent);
          if (propsObjectPattern) {
            const { node: { properties = [] } } = propsObjectPattern;
            const foundProps = properties
              .map(
                ({
                  value: {
                    type: valueType,
                    name: valueName,
                    left: { name: leftName } = {}
                  } = {}
                }) => {
                  if (
                    valueType === 'Identifier' ||
                    valueType === 'AssignmentPattern'
                  ) {
                    return valueName || leftName;
                  }

                  return undefined;
                }
              )
              .filter(name => name);
            if (props.length) {
              props
                .map(camelCase)
                .filter(prop => foundProps.indexOf(prop) === -1)
                .filter(
                  (prop, index, collection) =>
                    collection.indexOf(prop) === index
                )
                .forEach(prop => {
                  propsObjectPattern.pushContainer(
                    'properties',
                    t.objectProperty(
                      t.identifier(prop),
                      t.identifier(prop),
                      false,
                      true
                    )
                  );
                });
            }
            if (dispatchProps.length) {
              dispatchProps
                .map(camelCase)
                .filter(dispatchProp => foundProps.indexOf(dispatchProp) === -1)
                .filter(prop => props.indexOf(prop) === -1)
                .forEach(dispatchProp => {
                  propsObjectPattern.pushContainer(
                    'properties',
                    t.AssignmentExpression(
                      '=',
                      t.identifier(dispatchProp),
                      t.arrowFunctionExpression([], t.blockStatement([]))
                    )
                  );
                });
            }
          }
        }
      }
    }
  }
});
