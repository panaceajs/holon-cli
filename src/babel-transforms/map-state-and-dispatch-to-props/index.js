const babelTemplate = require('@babel/template').default;
const camelCase = require('camel-case');
const {
  findVariableDeclaration,
  findCallExpression,
  findReturnObjectExpression,
  findArrowFunctionExpression
} = require('../utils');
const { findLastImportDeclaration } = require('../utils/import');

const buildMapStateToProps = babelTemplate(
  `const mapStateToProps = ({}) => ({
})`,
  { sourceType: 'module', retainLines: true }
);

const buildMapDispatchToProps = babelTemplate(
  `const mapDispatchToProps = dispatch => ({
})`,
  { sourceType: 'module' }
);

const completeConnectFunctions = (
  path,
  { mapProps = [], actionTypes = {}, stateNamespace, t }
) => {
  let mapStateToProps = null;
  let mapDispatchToProps = null;
  const allMappedProps = [
    ...mapProps,
    ...Object.values(actionTypes).filter(v => v)
  ].filter((v, index, all) => all.indexOf(v) === index);

  if (allMappedProps.length) {
    // need mapStateToProps?
    mapStateToProps = findVariableDeclaration(path, 'mapStateToProps');
    if (!mapStateToProps) {
      const lastImportDeclaration = findLastImportDeclaration(path);
      if (lastImportDeclaration) {
        // let's insert it just below the last import declara
        lastImportDeclaration.insertAfter(buildMapStateToProps());
        mapStateToProps = findVariableDeclaration(path, 'mapStateToProps');
      }
    }

    // add deconstructed params with namespace
    const afe = findArrowFunctionExpression(mapStateToProps);

    if (afe.get('params').length === 0) {
      // no params whatsoever
      afe.pushContainer('params', t.objectPattern([]));
    }
    const firstParam = afe.get('params.0');
    const getShit = param =>
      param.get('properties').reduce((found, property) => {
        const key = property.get('key');
        const value = property.get('value');
        if (key && key.isIdentifier() && key.node.name === stateNamespace) {
          if (value && value.isObjectPattern()) {
            return property.get('value');
          }
          throw new Error(`Expected \`mapStateToProps()\` state namespace parameter object value to
be an object, but got ${value.type}, aborting.`);
        }
        return found;
      }, undefined);
    // ok, we have a param object here
    // is there a state namespace, if so, get that object first
    let br;
    if (stateNamespace) {
      try {
        br = getShit(firstParam);
        if (!br) {
          firstParam.pushContainer(
            'properties',
            t.objectProperty(t.identifier(stateNamespace), t.objectPattern([]))
          );
          br = getShit(firstParam);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      br = firstParam;
    }
    // find *all* objectProperty keys
    const keys = [];
    firstParam.traverse({
      ObjectProperty(innerPath) {
        const key = innerPath.get('key');
        const value = innerPath.get('value');
        if (!value.isObjectPattern()) {
          keys.push(key.node.name);
        }
      }
    });

    allMappedProps
      .map(camelCase)
      .filter(mapProp => keys.indexOf(mapProp) === -1)
      .forEach(mapProp => {
        br.pushContainer(
          'properties',
          t.objectProperty(
            t.identifier(mapProp),
            t.identifier(mapProp),
            false,
            true
          )
        );
      });

    const mapReturnObject = findReturnObjectExpression(mapStateToProps);

    if (mapReturnObject) {
      const foundMapObjectProperties = mapReturnObject
        .get('properties')
        .map(property => property.get('key').node.name);

      const mapObjectProperties = allMappedProps
        .map(camelCase)
        .filter(mapProp => foundMapObjectProperties.indexOf(mapProp) === -1)
        .map(mapProp =>
          t.objectProperty(t.identifier(mapProp), t.identifier(mapProp))
        );

      if (mapObjectProperties.length) {
        mapReturnObject.pushContainer('properties', mapObjectProperties);
      }
    }
  }

  if (Object.keys(actionTypes).length) {
    mapDispatchToProps = findVariableDeclaration(path, 'mapDispatchToProps');
    // need mapDispatchToProps?
    if (!mapDispatchToProps) {
      const lastImportDeclaration = findLastImportDeclaration(path);
      // let's insert it just below the last import declarations
      const mapDispatchToPropsNode = buildMapDispatchToProps();
      if (mapStateToProps) {
        mapStateToProps.insertAfter(mapDispatchToPropsNode);
      } else if (lastImportDeclaration) {
        lastImportDeclaration.insertAfter(mapDispatchToPropsNode);
      }
      mapDispatchToProps = findVariableDeclaration(path, 'mapDispatchToProps');
    }
    // find the return object
    const dispatchReturnObject = findReturnObjectExpression(mapDispatchToProps);
    if (dispatchReturnObject) {
      // find existing keys
      const foundDispatchObjectProperties = dispatchReturnObject
        .get('properties')
        .map(property => property.get('key').node.name);

      // add missing object props
      const dispatchObjectProperties = Object.keys(actionTypes)
        .map(camelCase)
        .filter(
          actionType => foundDispatchObjectProperties.indexOf(actionType) === -1
        )
        .map(actionType =>
          t.objectProperty(
            t.identifier(actionType),
            t.arrowFunctionExpression(
              [t.identifier('payload')],
              t.blockStatement([
                t.expressionStatement(
                  t.callExpression(t.identifier('dispatch'), [
                    t.callExpression(t.identifier(actionType), [
                      t.identifier('payload')
                    ])
                  ])
                )
              ])
            )
          )
        );

      if (dispatchObjectProperties.length) {
        dispatchReturnObject.pushContainer(
          'properties',
          dispatchObjectProperties
        );
      }
    }
  }

  return { mapStateToProps, mapDispatchToProps };
};

module.exports = ({ types: t }) => ({
  name: 'holon-map-state-and-dispatch-to-props',
  visitor: {
    Program(
      path,
      { opts: { mapProps = [], actionTypes = {}, stateNamespace } }
    ) {
      // let's inspect connect first
      const allMappedProps = [
        ...mapProps,
        ...Object.values(actionTypes).filter(v => v)
      ].filter((v, index, all) => all.indexOf(v) === index);
      const connectCallExpression = findCallExpression(path, 'connect');
      if (!connectCallExpression) {
        console.error(
          'Expected a connect() call, but could not find it, aborting'
        );
        return;
      }

      if (connectCallExpression.get('arguments').length > 2) {
        console.error(
          `It seems \`connect()\` is called with 3 arguments, aborting.`
        );
        console.error();
      }
      // great, found it
      // let's figure out if there are methods other than
      // `mapStateToProps` or `mapDispatchToProps`
      // if so, all bets are off.

      if (allMappedProps.length) {
        // let's check mapStateToProps first
        const mapStateToProps = findVariableDeclaration(
          path,
          'mapStateToProps'
        );
        if (mapStateToProps) {
          const mapStateToPropsAFE = findArrowFunctionExpression(
            mapStateToProps
          );
          if (mapStateToPropsAFE) {
            const params = mapStateToPropsAFE.get('params');
            if (params.length) {
              if (!t.isObjectPattern(params[0])) {
                console.error(
                  `mapStateToProps() first parameter should be empty or an ObjectPattern, got ${
                    params[0].type
                  }, aborting.`
                );
              }
            }
          }
        }
      }
      const { mapStateToProps, mapDispatchToProps } = completeConnectFunctions(
        path,
        {
          mapProps,
          actionTypes,
          stateNamespace,
          t
        }
      );
      connectCallExpression.node.arguments = [];

      if (mapStateToProps || mapDispatchToProps) {
        connectCallExpression.pushContainer(
          'arguments',
          mapStateToProps ? t.identifier('mapStateToProps') : t.nullLiteral()
        );

        connectCallExpression.pushContainer(
          'arguments',
          mapDispatchToProps
            ? t.identifier('mapDispatchToProps')
            : t.nullLiteral()
        );
      }
    }
  }
});
