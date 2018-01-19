import React from 'react';<%
if(component.withStyles) {%>
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  changeMe: {
    // 🔥 do your stylish thing here
  }
});
<% }%>
<%= component.withStyles ? `const ${component.name} = `:'export default ' %>(<% if(component.props || component.withStyles){%>{ <%= [...([component.withStyles? ['classes'] : []]), ...(component.props ? component.props: [])].join(', ') %> }<% } %>) => (
  <div<%= component.withStyles ? ' className={classes.changeMe}': ''%>>
    <h3><%=component.name %></h3><% if(component.props){ %>
    <ul>
<% component.props.forEach(propName => {
%>      <li><%=propName%>: {<%=propName%>}</li>
<% })%>    </ul>
  <% } %></div>
);
<% if(component.withStyles) {%>
export default withStyles(styles, { useTheme: true })(<%= component.name %>);
<% }%>
