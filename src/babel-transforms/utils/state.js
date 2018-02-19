const types = require('@babel/types');

const completeActionTypes = (namespaceContainer, actionTypes) => {
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

module.exports = {
  completeActionTypes
};
