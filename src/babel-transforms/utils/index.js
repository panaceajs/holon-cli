const types = require('@babel/types');
//
// module.exports.findLastImportDeclaration = path =>
//   path.get('body').reduce((lastImportDeclaration, statement) => {
//     if (types.isImportDeclaration(statement)) {
//       return statement;
//     }
//     return lastImportDeclaration;
//   }, undefined);

// module.exports.findVariableDeclaration = (path, name) =>
//   path.get('body').reduce((foundVariableDeclaration, statement) => {
//     if (
//       !foundVariableDeclaration &&
//       types.isVariableDeclaration(statement) &&
//       statement.get('declarations.0.id') &&
//       statement.get('declarations.0.id').node.name === name
//     ) {
//       return statement;
//     }
//     return foundVariableDeclaration;
//   }, undefined);

module.exports.findVariableDeclaration = (path, name) => {
  const cache = {};

  path.traverse({
    VariableDeclaration(innerPath) {
      const declarationName = innerPath.get('declarations.0.id');
      if (declarationName && declarationName.node.name === name) {
        cache[name] = innerPath;
      }
    }
  });

  return cache[name];
};
const findFunctions = path => {
  const fns = {};
  path.traverse({
    FunctionDeclaration(functionPath) {
      fns[functionPath.get('id').node.name] = functionPath;
    },
    VariableDeclaration(functionPath) {
      const declarations = functionPath.get('declarations');
      if (declarations && declarations.length) {
        const [variableDeclarator] = declarations;
        if (variableDeclarator) {
          const init = variableDeclarator.get('init');
          if (init && types.isArrowFunctionExpression(init)) {
            // gotcha
            const id = variableDeclarator.get('id');
            if (id && id.node.name) {
              fns[id.node.name] = functionPath;
            }
          }
        }
      }
    }
  });

  return fns;
};

const doesFunctionReturnReactComponent = path => {
  const searchArrowFunctionExpression = innerPath => {
    const body = innerPath.get('body');
    if (body) {
      if (types.isJSXElement(body)) {
        // const sfc = () => <div>stuff</div>
        return true;
      } else if (types.isBlockStatement(body)) {
        // const sfc = () => { returm <div>asdasd</div> }

        const innerBody = body.get('body');
        if (innerBody && innerBody.length) {
          const returnStatement = innerBody.reduce(
            (foundReturnStatement, current) => {
              if (foundReturnStatement) {
                return foundReturnStatement;
              }

              if (types.isReturnStatement(current)) {
                return current;
              }

              return foundReturnStatement;
            },
            undefined
          );

          if (returnStatement) {
            const argument = returnStatement.get('argument');
            if (argument && types.isJSXElement(argument)) {
              return true;
            }
          }
        }
      }
    }
  };

  if (types.isVariableDeclaration(path)) {
    /*
    const sfc = () => <div>stuff</div>

    const sfc = () => { returm <div>asdasd</div> }
    */
    const declarations = path.get('declarations');
    if (declarations && declarations.length) {
      const [declarator] = declarations;
      if (declarator && types.isVariableDeclarator(declarator)) {
        const init = declarator.get('init');

        if (init && types.isArrowFunctionExpression(init)) {
          return searchArrowFunctionExpression(init);
        }
      }
    }
  } else if (types.isExportDefaultDeclaration(path)) {
    /*
    export default () => <div>stuff</div>

    export default () => { returm <div>asdasd</div> }
    */
    const declaration = path.get('declaration');
    if (declaration && types.isArrowFunctionExpression(declaration)) {
      return searchArrowFunctionExpression(declaration);
    }
  } else if (types.isFunctionDeclaration(path)) {
    /*
    function sfc () {
      return <div>stuff</div>
    }
    */
    const body = path.get('body');
    if (body) {
      const innerBody = body.get('body');

      if (innerBody && innerBody.length) {
        const returnStatement = innerBody.reduce(
          (foundReturnStatement, current) => {
            if (foundReturnStatement) {
              return foundReturnStatement;
            }

            if (types.isReturnStatement(current)) {
              return current;
            }

            return foundReturnStatement;
          },
          undefined
        );

        if (returnStatement) {
          const argument = returnStatement.get('argument');
          if (argument && types.isJSXElement(argument)) {
            return true;
          }
        }
      }
    }
  }
};

const findReactComponents = path => {
  const fns = findFunctions(path);
  return Object.keys(fns).reduce((sfc, name) => {
    const found = fns[name];

    if (doesFunctionReturnReactComponent(found)) {
      return { ...sfc, [name]: found };
    }

    return sfc;
  }, {});
};

const findExportDefaultReactComponent = path => {
  // find export default
  let exportDefaultDeclarationPath;
  path.traverse({
    ExportDefaultDeclaration(innerPath) {
      exportDefaultDeclarationPath = innerPath;
    }
  });

  // is it a react component?
  if (doesFunctionReturnReactComponent(exportDefaultDeclarationPath)) {
    return exportDefaultDeclarationPath;
  }
};

const findExportReactComponentIdentifier = path => {
  let foundExport;
  path.traverse({
    ExportDefaultDeclaration(innerPath) {
      const declaration = innerPath.get('declaration');
      if (declaration) {
        if (types.isIdentifier(declaration)) {
          const name = declaration.node.name;
          // ok we have an identifier
          // const scope = path.get('scope');
          if (path.scope.bindings) {
            const foundExportBinding = path.scope.bindings[name];
            if (foundExportBinding) {
              if (
                doesFunctionReturnReactComponent(
                  foundExportBinding.path.parentPath
                )
              ) {
                foundExport = foundExportBinding.path.parentPath;
              }
            }
          }
        } else if (types.isCallExpression(declaration)) {
          // we have a call expression

          declaration.traverse({
            Identifier(identifierPath) {
              if (path.scope.bindings[identifierPath.node.name]) {
                const foundParamBinding =
                  path.scope.bindings[identifierPath.node.name];

                if (foundParamBinding) {
                  if (
                    doesFunctionReturnReactComponent(
                      foundParamBinding.path.parentPath
                    )
                  ) {
                    foundExport = foundParamBinding.path.parentPath;
                  }
                }
              }
            }
          });
        }
      }
    }
  });

  return foundExport;
};

const findReactFunctionExpression = path => {
  let reactFunctionExpression;
  path.traverse({
    ArrowFunctionExpression(innerPath) {
      if (types.isJSXElement(innerPath.get('body'))) {
        reactFunctionExpression = innerPath;
      }
    }
  });

  return reactFunctionExpression;
};

const findExportedReactComponent = path => {
  const exportedReactComponent = findExportDefaultReactComponent(path);

  if (exportedReactComponent) {
    return exportedReactComponent;
  }
  return findExportReactComponentIdentifier(path);
};

module.exports.findAssignmentExpression = (path, predicate = () => {}) => {
  let result;
  path.traverse({
    AssignmentExpression(innerPath) {
      if (!result && predicate(innerPath.get('left'), innerPath.get('right'))) {
        result = innerPath;
      }
    }
  });

  return result;
};
module.exports.findCallExpression = (path, name) => {
  const cache = {};
  path.traverse(
    {
      CallExpression(callExpressionPath) {
        const callee = callExpressionPath.get('callee');
        if (callee && callee.get('name').node === name) {
          this.cache[name] = callExpressionPath;
        }
      }
    },
    { cache }
  );

  return cache[name];
};
module.exports.findCallExpressions = (path, name) => {
  const cache = [];
  path.traverse({
    CallExpression(callExpressionPath) {
      const callee = callExpressionPath.get('callee');
      if (callee && callee.get('name').node === name) {
        cache.push(callExpressionPath);
      }
    }
  });

  return cache;
};

module.exports.findReturnObjectExpression = arrowFunctionExpressionPath => {
  let objectExpression;
  const body = arrowFunctionExpressionPath.get('declarations.0.init.body');
  if (body) {
    if (types.isObjectExpression(body)) {
      objectExpression = body;
    } else if (types.isBlockStatement(body)) {
      // find

      objectExpression = body
        .get('body')
        .reduce((foundReturnStatement, statement) => {
          if (
            !foundReturnStatement &&
            types.isReturnStatement(statement) &&
            types.isObjectExpression(statement.get('argument'))
          ) {
            return statement.get('argument');
          }
          return foundReturnStatement;
        }, undefined);
    }
  }

  return objectExpression;
};

module.exports.findArrowFunctionExpression = path => {
  let arrowFunctionExpression;
  if (path && path.isVariableDeclaration()) {
    const declaration = path.get('declarations.0');

    if (declaration && declaration.isVariableDeclarator()) {
      const init = declaration.get('init');
      if (init && init.isArrowFunctionExpression()) {
        arrowFunctionExpression = init;
      }
    }
  }

  return arrowFunctionExpression;
};

const findOrCreateParams = path => {
  let propsObjectPattern;
  const functionExpression = findReactFunctionExpression(path);
  if (functionExpression) {
    let params = functionExpression.get('params');
    if (params.length) {
      propsObjectPattern = params[0];
    } else {
      functionExpression.pushContainer('params', types.objectPattern([]));
      params = functionExpression.get('params');
      propsObjectPattern = params[0];
    }
  }

  return propsObjectPattern;
};
const findParams = path => {
  let propsObjectPattern;
  const functionExpression = findReactFunctionExpression(path);
  if (functionExpression) {
    const params = functionExpression.get('params');
    if (params.length) {
      propsObjectPattern = params[0];
    }
  }

  return propsObjectPattern;
};

module.exports.findFunctions = findFunctions;
module.exports.findReactComponents = findReactComponents;
module.exports.findExportDefaultReactComponent = findExportDefaultReactComponent;
module.exports.findExportReactComponentIdentifier = findExportReactComponentIdentifier;
module.exports.findReactFunctionExpression = findReactFunctionExpression;
module.exports.findExportedReactComponent = findExportedReactComponent;
module.exports.findOrCreateParams = findOrCreateParams;
module.exports.findParams = findParams;
