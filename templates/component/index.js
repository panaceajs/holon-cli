const constantCase = require('constant-case');
const camelCase = require('camel-case');
const ucFirst = require('upper-case-first');

module.exports = ({ component: { name, withStyles, props } }) => {
  const allProps = withStyles || props ? [...(withStyles ? [`classes`] : []), ...(props ? props : [])] : [];
  const componentName = ucFirst(camelCase(name));
  return `import React from 'react';
${withStyles?`import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  changeMe: {
    // 🔥 do your stylish thing here
  }
});
`:``}
${withStyles?`const ${componentName} =`: `export default`} (${allProps.length ? `{ ${allProps.join(', ')} }`: ``}) => (
  <div${withStyles?` className={classes.changeName}`:``}>
    <h2>${name}</h2>${props ?`
    <ul>
${props.map(prop =>
`      <li>${prop}: {${prop}}</li>`).join('\n')}
    </ul>`:``}
  </div>
);
${withStyles?`
export default withStyles(styles, { withTheme: true })(${componentName});
`:``}`;
}
