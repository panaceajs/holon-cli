const types = require('@babel/types');

const findImportDeclaration = (path, targetPath) =>
  path.get('body').reduce((importDeclaration, statement) => {
    if (types.isImportDeclaration(statement)) {
      const source = statement.get('source');
      if (source) {
        if (source.node.value === targetPath) {
          return statement;
        }
      }
    }
    return importDeclaration;
  }, undefined);

const findLastImportDeclaration = path =>
  path.get('body').reduce((lastImportDeclaration, statement) => {
    if (types.isImportDeclaration(statement)) {
      return statement;
    }
    return lastImportDeclaration;
  }, undefined);
const findImportSpecifier = (path, name, defaultImport) => {
  const specifiers = path.get('specifiers');
  if (specifiers) {
    return specifiers.reduce((found, specifier) => {
      if (!found) {
        const isSpecificImportSpecifier = defaultImport
          ? types.isImportDefaultSpecifier
          : types.isImportSpecifier;
        if (isSpecificImportSpecifier(specifier)) {
          const local = specifier.get('local');
          if (local) {
            const localName = local.get('name');
            if (localName) {
              if (localName.node === name) {
                return path;
              }
            }
          }
        }
      }

      return found;
    }, undefined);
  }
};

const createImportSpecifier = (imported, local) =>
  types.importSpecifier(
    types.identifier(imported),
    types.identifier(local || imported)
  );

const createImportDefaultSpecifier = name =>
  types.importDefaultSpecifier(types.identifier(name));

const createImportDeclaration = importPath =>
  types.importDeclaration([], types.stringLiteral(importPath));

const isObject = obj => obj === Object(obj);

const createAndInsertImportDeclaration = (programPath, pathToImport) => {
  const importDeclaration = createImportDeclaration(pathToImport);
  if (types.isImportDeclaration(importDeclaration)) {
    const declarations = programPath
      .get('body')
      .filter(types.isImportDeclaration);
    if (!declarations.length) {
      programPath.unshiftContainer('body', importDeclaration);
    } else {
      const sourcePath = importDeclaration.source.value;
      if (sourcePath.match(/^[./]+/)) {
        declarations[declarations.length - 1].insertAfter(importDeclaration);
      } else {
        const packageImports = declarations.filter(
          declaration => !declaration.get('source.value').node.match(/^[./]+/)
        );

        if (packageImports.length) {
          packageImports[packageImports.length - 1].insertAfter(
            importDeclaration
          );
        } else {
          programPath.unshiftContainer('body', importDeclaration);
        }
      }
    }
  }
  return findImportDeclaration(programPath, pathToImport);
};

const addImport = (path, imports = [], importPath) => {
  // programPath

  let importDeclaration = findImportDeclaration(path, importPath);

  if (!importDeclaration) {
    importDeclaration = createAndInsertImportDeclaration(path, importPath);
  }

  const existingSpecifiers = importDeclaration
    .get('specifiers')
    .map(specifier => {
      if (types.isImportDefaultSpecifier(specifier)) {
        return { default: specifier.get('local').get('name').node };
      }
      const name = specifier.get('imported').get('name').node;
      return { [name]: name };
    })
    .reduce((all, o) => ({ ...all, ...o }), {});

  const specifiers = imports
    .map(o => (isObject(o) ? o : { [o]: o }))
    .reduce((all, o) => {
      const key = Object.keys(o)[0];
      if (!existingSpecifiers[key] || existingSpecifiers[key] !== o[key]) {
        return { ...all, ...o };
      }

      return all;
    }, {});
  Object.keys(specifiers).forEach(imported => {
    if (imported === 'default') {
      importDeclaration.unshiftContainer(
        'specifiers',
        createImportDefaultSpecifier(specifiers[imported])
      );
    } else {
      importDeclaration.pushContainer(
        'specifiers',
        createImportSpecifier(specifiers[imported])
      );
    }
  });
};

const removeImport = (path, imports = [], importPath) => {
  const importDeclaration = findImportDeclaration(path, importPath);

  if (importDeclaration) {
    const specifiers = imports
      .map(o => (isObject(o) ? o : { [o]: o }))
      .reduce((all, o) => ({ ...all, ...o }), {});

    const existingSpecifiers = importDeclaration
      .get('specifiers')
      .map(specifier => {
        if (types.isImportDefaultSpecifier(specifier)) {
          return { default: specifier.get('local').get('name').node };
        }
        const name = specifier.get('imported').get('name').node;
        return { [name]: name };
      })
      .reduce((all, o) => {
        const key = Object.keys(o)[0];
        if (!specifiers[key] || specifiers[key] !== o[key]) {
          return { ...all, ...o };
        }

        return all;
      }, {});

    if (Object.keys(existingSpecifiers).length === 0) {
      importDeclaration.remove();
    } else {
      importDeclaration.node.specifiers = [];
      Object.keys(existingSpecifiers).forEach(imported => {
        if (imported === 'default') {
          importDeclaration.unshiftContainer(
            'specifiers',
            createImportDefaultSpecifier(existingSpecifiers[imported])
          );
        } else {
          importDeclaration.pushContainer(
            'specifiers',
            createImportSpecifier(existingSpecifiers[imported])
          );
        }
      });
    }
  }
};

module.exports = {
  findImportDeclaration,
  findImportSpecifier,
  createImportSpecifier,
  addImport,
  removeImport,
  createAndInsertImportDeclaration,
  findLastImportDeclaration
};
