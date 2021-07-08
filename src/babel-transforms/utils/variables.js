const types = require('@babel/types');

module.exports.findVariableDeclarator = (path, { kind = 'const', name }) => {
  const results = [];
  path.traverse({
    VariableDeclarator(innerPath) {
      const { parentPath } = innerPath;
      if (
        types.isVariableDeclaration(parentPath) &&
        parentPath.get('kind') &&
        parentPath.get('kind').node === kind &&
        innerPath.get('id') &&
        innerPath.get('id.name') &&
        innerPath.get('id.name').node === name
      ) {
        results.push(innerPath);
      }
    }
  });

  return results;
};

module.exports.createVariableDeclaration = () => {};
