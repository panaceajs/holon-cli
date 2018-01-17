import React from 'react';
import { shallow } from 'enzyme';
import <%= component.name %> from '../';

describe('<%= component.name %> component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<<%= component.name %> />);
    expect(wrapper).toMatchSnapshot();
  });
<% if(component.props) {
  component.props.forEach(prop => {
    %>
  it('should set `<%= prop %>` prop correctly', () => {
    const <%= prop%> = 'prop value';
    const wrapper = shallow(<<%= component.name %> <%= prop %>={<%= prop %>} />);
    expect(wrapper).toMatchSnapshot();
  });<%
  });
} %>
});
