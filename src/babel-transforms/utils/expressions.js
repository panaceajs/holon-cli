module.exports.findAssignmentExpression = (
  path,
  { name, object, property }
) => {
  const results = [];
  path.traverse({
    AssignmentExpression(innerPath) {
      if (
        (name &&
          innerPath.get('left').isIdentifier() &&
          innerPath.get('left.name') &&
          innerPath.get('left.name').node === name) ||
        (object &&
          property &&
          innerPath.get('left.object').isIdentifier() &&
          innerPath.get('left.property').isIdentifier() &&
          innerPath.get('left.object.name').node === object &&
          innerPath.get('left.property.name').node === property)
      ) {
        results.push(innerPath);
      }
    }
  });

  return results;
};

module.exports.createAssignmentExpression = () => {};
