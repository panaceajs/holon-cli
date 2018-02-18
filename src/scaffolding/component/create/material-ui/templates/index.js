module.exports = ({
  component: { componentName, props, dispatchProps = [] }
}) => {
  const allProps = props ? [...[`classes`], ...(props || [])] : [];
  const paramProps = [
    ...allProps,
    ...dispatchProps.map(functionProp => `${functionProp} = () => {}`)
  ];

  return `import React from 'react';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  changeMe: {
    // 🔥 do your stylish thing here
  }
});

const ${componentName} = (${
    paramProps.length ? `{ ${paramProps.join(', ')} }` : ``
  }) => (
  <div className={classes.changeMe}>
    <h2 className="holon-component-title">${componentName}</h2>
    <ul className="holon-component-props">
${props.map(prop => `      <li>${prop}: {${prop}}</li>`).join('\n')}
${dispatchProps
    .map(
      prop =>
        `      <li>
        <button type="button" onClick={() => ${prop}()}>
          ${prop} action
        </button>
      </li>`
    )
    .join('\n')}
    </ul>
  </div>
);

export default withStyles(styles, { withTheme: true })(${componentName});
`;
};
