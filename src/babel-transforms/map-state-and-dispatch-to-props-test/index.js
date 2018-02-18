module.exports = ({ types: t }) => ({
  name: 'holon-map-state-and-dispatch-to-props-test',
  visitor: {
    CallExpression(path, { opts: { actionTypes = {}, mapProps = [] } = {} }) {
      if (
        t.isIdentifier(path.get('callee').node, { name: 'it' }) &&
        t.isStringLiteral(path.get('arguments.0').node, {
          value: 'maps state and dispatch to props'
        })
      ) {
        path.traverse({
          ObjectExpression(innerPath) {
            if (
              t.isCallExpression(innerPath.parentPath) &&
              t.isMemberExpression(innerPath.parentPath.get('callee')) &&
              innerPath.parentPath.get('callee.object') &&
              t.isIdentifier(innerPath.parentPath.get('callee.object').node, {
                name: 'expect'
              }) &&
              innerPath.parentPath.get('callee.property') &&
              t.isIdentifier(innerPath.parentPath.get('callee.property').node, {
                name: 'objectContaining'
              })
            ) {
              const keyNames = innerPath
                .get('properties')
                .map(property => property.get('key.name').node);

              Object.keys(actionTypes)
                .filter(
                  propFunctionName => keyNames.indexOf(propFunctionName) === -1
                )
                .forEach(propFunctionName => {
                  innerPath.pushContainer(
                    'properties',
                    t.objectProperty(
                      t.identifier(propFunctionName),

                      t.callExpression(
                        t.memberExpression(
                          t.identifier('expect'),
                          t.identifier('any')
                        ),
                        [t.identifier('Function')]
                      )
                    )
                  );
                });
              [...Object.values(actionTypes), ...mapProps]
                .filter(propName => keyNames.indexOf(propName) === -1)
                .forEach(propName => {
                  innerPath.pushContainer(
                    'properties',
                    t.objectProperty(
                      t.identifier(propName),
                      t.stringLiteral(`${propName}-initial-value`)
                    )
                  );
                });
            }
          }
        });
      }
    }
  }
});
