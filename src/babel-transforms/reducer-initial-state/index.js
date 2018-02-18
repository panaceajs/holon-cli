const types = require('@babel/types');

const fix = (namespaceContainer, actionTypes) => {
  const propertyNames = namespaceContainer
    .get('properties')
    .map(({ node: { key: { name } = {} } }) => name);
  Object.keys(actionTypes)
    .filter(
      actionType =>
        propertyNames.indexOf(actionTypes[actionType] || actionType) === -1
    )
    .forEach(actionType => {
      namespaceContainer.pushContainer(
        'properties',
        types.objectProperty(
          types.identifier(actionTypes[actionType] || actionType),
          types.stringLiteral(
            `${actionTypes[actionType] || actionType}-initial-value`
          )
        )
      );
    });
};

module.exports = ({ types: t }) => ({
  name: 'holon-reducer-initial-state',
  visitor: {
    AssignmentPattern(
      path,
      { opts: { actionTypes = {}, stateKey = 'state', stateNamespace } }
    ) {
      if (
        stateKey &&
        t.isIdentifier(path.get('left').node, { name: stateKey }) &&
        t.isObjectExpression(path.get('right').node)
      ) {
        if (stateNamespace) {
          let namespaceContainer = path
            .get('right.properties')
            .filter(
              property =>
                t.isIdentifier(property.get('key').node, {
                  name: stateNamespace
                }) && t.isObjectExpression(property.get('value'))
            )
            .reduce((foundNamespaceContainer, objectProperty) => {
              if (!foundNamespaceContainer && objectProperty) {
                return objectProperty.get('value');
              }
              return foundNamespaceContainer;
            }, undefined);

          if (!namespaceContainer) {
            path
              .get('right')
              .pushContainer(
                'properties',
                t.objectProperty(
                  t.identifier(stateNamespace),
                  t.objectExpression([])
                )
              );
            const initProperties = path.get('right.properties');

            namespaceContainer = initProperties[initProperties.length - 1].get(
              'value'
            );
          }

          fix(namespaceContainer, actionTypes);
        }
      }
    },
    VariableDeclarator(
      path,
      { opts: { actionTypes = {}, stateNamespace, variableName = 'state' } }
    ) {
      if (
        variableName &&
        t.isIdentifier(path.get('id').node, { name: variableName }) &&
        t.isObjectExpression(path.get('init').node)
      ) {
        if (stateNamespace) {
          let namespaceContainer = path
            .get('init.properties')
            .filter(
              property =>
                t.isIdentifier(property.get('key').node, {
                  name: stateNamespace
                }) && t.isObjectExpression(property.get('value'))
            )
            .reduce((foundNamespaceContainer, objectProperty) => {
              if (!foundNamespaceContainer && objectProperty) {
                return objectProperty.get('value');
              }
              return foundNamespaceContainer;
            }, undefined);

          if (!namespaceContainer) {
            path
              .get('init')
              .pushContainer(
                'properties',
                t.objectProperty(
                  t.identifier(stateNamespace),
                  t.objectExpression([])
                )
              );
            const initProperties = path.get('init.properties');

            namespaceContainer = initProperties[initProperties.length - 1].get(
              'value'
            );
          }

          fix(namespaceContainer, actionTypes);
        }
      } else {
        //
      }
    }
  }
});
