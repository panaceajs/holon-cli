const camelCase = require('camel-case');
const constantCase = require('constant-case');
const ucFirst = require('upper-case-first');

const renderWrapper = (componentString, withStyles) =>
  `${
    withStyles
      ? `mount(<MuiThemeProvider theme={theme}>${componentString}</MuiThemeProvider>)`
      : `shallow(${componentString}, { dive: true })`
  }`;

module.exports = ({
  container: {
    name,
    withStyles,
    mapProps,
    dispatchProps,
    theme,
    stateNamespace
  }
}) => {
  const componentName = ucFirst(camelCase(name));
  return `import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import ${componentName} from '../';
${
    dispatchProps
      ? `import { ${dispatchProps
          .map(dispatchProp => camelCase(dispatchProp))
          .join(', ')} } from '../../../actions';
`
      : ``
  }
describe('\`${componentName}\` component', () => {
  let store;

  beforeEach(() => {
    const mockStore = configureStore();
    const initialState = { ${stateNamespace ? `${stateNamespace}: { ` : ``}${
    mapProps
      ? mapProps
          .map(mapProp => `${camelCase(mapProp)}: '${camelCase(mapProp)}'`)
          .join(', ')
      : ``
  }${stateNamespace ? ` } ` : ``}};
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it('should render properly', () => {
    const wrapper = ${renderWrapper(
      `<${componentName} store={store}/>`,
      withStyles
    )};
    expect(wrapper).toMatchSnapshot();
  });
${
    mapProps
      ? `
  it('maps state and dispatch to props', () => {
    const wrapper = ${renderWrapper(
      `<${componentName} store={store}/>`,
      withStyles
    )};
    expect(wrapper.props()).toEqual(
      expect.objectContaining({
        ${mapProps
          .map(mapProp => `${camelCase(mapProp)}: '${camelCase(mapProp)}'`)
          .join(', ')}
      })
    );
  });`
      : ``
  }
${
    dispatchProps
      ? `
${dispatchProps
          .map(
            dispatchProp => `  it('maps \`${camelCase(
              dispatchProp
            )}\` to dispatch \`${constantCase(dispatchProp)}\` action.', () => {
    const ${camelCase(dispatchProp)}Value = '${camelCase(dispatchProp)}Value';
    const wrapper = ${renderWrapper(
      `<${componentName} store={store}/>`,
      withStyles
    )};
    wrapper.props().${camelCase(dispatchProp)}(${camelCase(dispatchProp)}Value);

    expect(store.dispatch).toHaveBeenCalledWith(${camelCase(
      dispatchProp
    )}(${camelCase(dispatchProp)}Value));
  });`
          )
          .join('\n\n')}`
      : ``
  }
});
`;
};
