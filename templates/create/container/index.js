import { connect } from 'react-redux';
import <%= container.name %> from '../<%= container.targetComponent %>';
<% if(container.mappedProps){ %>
const mapStateToProps = state => ({
<%= container.mappedProps.map(mappedProp => `  ${mappedProp}: '${mappedProp}'`).join(',\n')%>
});
<% } %><% if(container.dispatchProps){ %>
const mapDispatchToProps = dispatch => ({
<%= container.dispatchProps.map(dispatchProp => `  ${dispatchProp}: payload => {
  const a = 10;
    // 🔥 import action creator to replace makeshift action below
    dispatch({
      type: '${utils.constantCase(dispatchProp)}',
      payload
    });
  }`).join(',\n')%>
});
<% } %><% if(container.mappedProps || container.dispatchProps) { %>
export default connect(<%= container.mappedProps ? `mapStateToProps`:`null` %>, <%= container.dispatchProps ? `mapDispatchToProps`:`null` %>)(<%= container.name %>);
<% } else { %>
export default connect()(<%= container.name %>);<% } %>
