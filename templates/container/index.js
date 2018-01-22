const camelCase = require('camel-case');
const ucFirst = require('upper-case-first');

module.exports = ({
  container: { name, targetComponent, stateNamespace, map, dispatch }
}) => {
  const componentName = ucFirst(camelCase(name));
  return `import { connect } from 'react-redux';
import ${componentName} from '../${targetComponent}';

${
    map
      ? `const mapStateToProps = ${
          map
            ? `({${stateNamespace ? ` ${stateNamespace}: {` : ``} ${map.join(
                ', '
              )} }${stateNamespace ? ` }` : ``})`
            : `state`
        } => ({
${map.map(mapProp => `  ${mapProp}`).join(',\n')}
});
`
      : ``
  }
${
    dispatch
      ? `const mapDispatchToProps = dispatch => ({
${dispatch
          .map(
            dispatchProp =>
              `  ${dispatchProp}: () => {
    dispatch({
      type: 'RANDOM_ACTION',
      payload: '${dispatchProp}'
    });
  }`
          )
          .join(',\n')}
});
`
      : ``
  }
export default connect(${map ? `mapStateToProps` : `null`}${
    dispatch ? `, mapDispatchToProps` : ``
  })(${componentName});
`;
};
