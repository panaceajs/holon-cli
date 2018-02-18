module.exports = ({
  layout: { holonName, magic, withComponent, withContainer, componentName }
}) => `import React from 'react';
${
  magic || withComponent || withContainer
    ? `import ${componentName} from '../../${
        withComponent ? `components` : `containers`
      }/${componentName}';`
    : ``
}
export default () => (
  <div>
    <h1>${holonName} layout</h1>
${magic || withComponent ? `<${componentName} />` : ``}
  </div>
);
`;
