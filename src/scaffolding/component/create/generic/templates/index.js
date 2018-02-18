module.exports = ({
  component: { componentName, props, dispatchProps = [] }
}) => {
  const paramProps = [
    ...props,
    ...dispatchProps.map(functionProp => `${functionProp} = () => {}`)
  ];

  return `import React from 'react';

export default (${paramProps.length ? `{ ${paramProps.join(', ')} }` : ``}) => (
  <div>
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
`;
};
