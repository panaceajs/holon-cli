const camelCase = require('camel-case');
const ucFirst = require('upper-case-first');

module.exports = ({
  container: { name, targetComponent, stateNamespace, mapProps, dispatchProps }
}) => {
  const componentName = ucFirst(camelCase(name));
  return `import { connect } from 'react-redux';
import ${componentName} from '../${targetComponent}';
${
    dispatchProps
      ? `import { ${dispatchProps
          .map(dispatchProp => camelCase(dispatchProp))
          .join(', ')} } from '../../actions';
`
      : ``
  }
${
    mapProps
      ? `const mapStateToProps = ${
          mapProps
            ? `({${
                stateNamespace ? ` ${stateNamespace}: {` : ``
              } ${mapProps.join(', ')} }${stateNamespace ? ` }` : ``})`
            : `state`
        } => ({
${mapProps.map(mapProp => `  ${mapProp}`).join(',\n')}
});
`
      : ``
  }
${
    dispatchProps
      ? `const mapDispatchToProps = dispatch => ({
${dispatchProps
          .map(
            dispatchProp =>
              `  ${dispatchProp}: payload => {
    dispatch(${camelCase(dispatchProp)}(payload));
  }`
          )
          .join(',\n')}
});
`
      : ``
  }
export default connect(${mapProps ? `mapStateToProps` : `null`}${
    dispatchProps ? `, mapDispatchToProps` : ``
  })(${componentName});
`;
};
