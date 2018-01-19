import React from 'react';
<% if(component.withStyles){
%>import { createMount } from 'material-ui/test-utils';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from 'shared/themes';<%
} else {
%>import { shallow } from 'enzyme'; <% } %>
import <%= component.name %> from '../';

describe('<%= component.name %> component', () => {<% if(component.withStyles){ %>
  let mount;
  beforeEach(() => {
    mount = createMount();
  });
<% } 
const renderWrapper = (target) => {
  return `${component.withStyles? 'mount': 'shallow'}(${component.withStyles? '<MuiThemeProvider theme={theme}>': ''}${target}${component.withStyles? '</MuiThemeProvider>': ''});`
}

%>
  it('should render correctly', () => {
    const wrapper = <%= renderWrapper(`<${component.name}/>`) %>
    expect(wrapper).toMatchSnapshot();
  });
<% if(component.props) {
  component.props.forEach(prop => {
    %>
  it('should set `<%= prop %>` prop correctly', () => {
    const <%= prop%> = 'prop value';
    const wrapper = <%= renderWrapper(`<${component.name} ${prop}={${prop}}/>`) %>
    expect(wrapper).toMatchSnapshot();
  });
<% });
} %>});
