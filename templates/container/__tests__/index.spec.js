const constantCase = require('constant-case');
const camelCase = require('camel-case');
const ucFirst = require('upper-case-first');

const renderWrapper = (componentString, withStyles) => `${withStyles?`mount(<MuiThemeProvider theme={theme}>${componentString}</MuiThemeProvider>)`:`shallow(${componentString}, { dive: true })`}`;

module.exports = ({ container: { name, mapProps, dispatchProps } }) => {
  const componentName = ucFirst(camelCase(name));
  return `// ohai
`}
