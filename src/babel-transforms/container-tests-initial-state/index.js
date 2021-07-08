const { completeActionTypes } = require('../utils/state');

module.exports = ({ types: t }) => ({
  name: 'holon-container-test-initial-state',
  visitor: {
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

          completeActionTypes(namespaceContainer, actionTypes);
        }
      }
    }
  }
});
