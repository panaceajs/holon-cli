import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import <%= container.name %> from '../';

const mockStore = configureStore();

describe('<%= container.name %> Container', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    // 🔥 create a nice initial state
    const initialState = { dummy: '🔥 REPLACE ME 🔥' };
    store = mockStore(initialState);
    store.dispatch = jest.fn();
    wrapper = shallow(<<%= container.name %> store={store} />);
  });

<% if(container.mappedProps && container.dispatchProps) { %>
  it('maps state and dispatch to props', () => {
    expect(wrapper.props()).toEqual(
      expect.objectContaining({
        <%= [...container.mappedProps.map(mappedProp => `${mappedProp}:'${mappedProp}'`), ...container.dispatchProps.map(dispatchProp => `${dispatchProp}:expect.any(Function)`)].join(',')%>
      })
    );
  });
<% } else if (container.mappedProps) { %>
  it('maps state to props', () => {
    expect(wrapper.props()).toEqual(
      expect.objectContaining({
        <%= container.mappedProps.map(mappedProp => `${mappedProp}:'${mappedProp}'`).join(',')%>
      })
    );
  });
<% } else if (container.dispatchProps){ %>
  it('maps dispatch to props', () => {
    expect(wrapper.props()).toEqual(
      expect.objectContaining({
        <%= container.dispatchProps.map(dispatchProp => `${dispatchProp}:expect.any(Function)`).join(',')%>
      })
    );
  });
<% }

if (container.dispatchProps) { %>
<%= container.dispatchProps.map(dispatchProp => `
it('maps \`${dispatchProp}\` action to prop', () => {
  // 🔥 create appropriate payload
  // 🔥 import action creator to replace makeshift action below
  const payload = 'payload';
  wrapper.props().${dispatchProp}(payload);

  expect(store.dispatch).toHaveBeenCalledWith({
    type: '${utils.constantCase(dispatchProp)}',
    payload
  });
});
`).join('\n') %>
<% } %>
});
