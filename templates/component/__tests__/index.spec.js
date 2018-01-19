const constantCase = require('constant-case');
const camelCase = require('camel-case');
const ucFirst = require('upper-case-first');

const renderWrapper = (componentString, withStyles) => `${withStyles?`mount(<MuiThemeProvider theme={theme}>${componentString}</MuiThemeProvider>)`:`shallow(${componentString}, { dive: true })`}`;

module.exports = ({ component: { name, withStyles, props } }) => {
  const componentName = ucFirst(camelCase(name));
  return `import React from 'react';
${withStyles?`import { createMount } from 'material-ui/test-utils';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from 'shared/themes';
`:`import { shallow } from 'enzyme';`}
import ${componentName} from '../';

describe('\`${componentName}\` component', () => {${withStyles ? `
  let mount;

  beforeEach(() => {
    mount = createMount();
  });
`:``}
  it('should render properly', () => {
    const wrapper = ${renderWrapper(`<${componentName} />`, withStyles)};
    expect(wrapper).toMatchSnapshot();
  });${props?`
${props.map(prop => `
  it('should set \`${prop}\` prop properly', () => {
    const ${prop}Value = '${prop} value';
    const wrapper = ${renderWrapper(`<${componentName} ${prop}={${prop}Value}/>`, withStyles)};
    expect(wrapper).toMatchSnapshot();
  });`).join('\n')}
`:``}
});
`}
