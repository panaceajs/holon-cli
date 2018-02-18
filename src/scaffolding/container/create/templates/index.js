const camelCase = require('camel-case');

module.exports = ({
  container: { actionTypes = {}, componentName, stateNamespace, mapProps = [] }
}) => {
  const actionCreators = Object.keys(actionTypes);

  const allMappedProps = [
    ...mapProps,
    ...(actionCreators.length
      ? actionCreators.reduce((props, actionCreator) => {
          if (actionTypes[actionCreator]) {
            return [...props, actionTypes[actionCreator]];
          }

          return props;
        }, [])
      : [])
  ];

  return `import { connect } from 'react-redux';
  import ${componentName} from '../../components/${componentName}';
  ${
    actionCreators.length
      ? `import { ${actionCreators
          .map(action => camelCase(action))
          .join(', ')} } from '../../actions';
  `
      : ``
  }
  ${
    allMappedProps.length
      ? `const mapStateToProps = ${
          allMappedProps
            ? `({${
                stateNamespace ? ` ${stateNamespace}: {` : ``
              } ${allMappedProps.join(', ')} }${stateNamespace ? ` }` : ``})`
            : `state`
        } => ({
  ${allMappedProps.map(mapProp => `  ${mapProp}`).join(',\n')}
  });
  `
      : ``
  }
  ${
    actionCreators.length
      ? `const mapDispatchToProps = dispatch => ({
  ${actionCreators
    .map(
      action =>
        `  ${action}: payload => {
      dispatch(${camelCase(action)}(payload));
    }`
    )
    .join(',\n')}
  });
  `
      : ``
  }
  export default connect(${allMappedProps.length ? `mapStateToProps` : `null`}${
    actionCreators.length ? `, mapDispatchToProps` : ``
  })(${componentName});
  `;
};
