import React from 'react';

export default (<% if(component.props){%>{ <%= component.props.join(', ') %> }<% } %>) => (
  <div>
    <h3><%=component.name %></h3><% if(component.props){ %>
    <ul>
<% component.props.forEach(propName => {
%>      <li><%=propName%>: {<%=propName%>}</li>
<% })%>    </ul>
  <% } %></div>
);
