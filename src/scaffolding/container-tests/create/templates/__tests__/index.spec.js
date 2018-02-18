const camelCase = require('camel-case');
const constantCase = require('constant-case');

module.exports = ({
  container: { actionTypes, componentName, mapProps, stateNamespace }
}) => {
  const actionCreators = Object.keys(actionTypes);

  const allMappedProps = [
    ...mapProps,
    ...(actionCreators.length
      ? actionCreators.reduce((props, actionCreator) => {
          if (actionTypes[actionCreator]) {
            return [...props, actionTypes[actionCreator]];
          }

          return props;
        }, [])
      : [])
  ];

  return `import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import ${componentName} from '../';
${
    actionCreators.length
      ? `import { ${actionCreators
          .map(actionCreator => camelCase(actionCreator))
          .join(', ')} } from '../../../actions';
`
      : ``
  }
describe('\`${componentName}\` container', () => {
  let store;
  beforeEach(() => {
    const mockStore = configureStore();
    const initialState = { ${stateNamespace ? `${stateNamespace}: { ` : ``}${
    allMappedProps.length
      ? allMappedProps
          .map(
            mapProp =>
              `${camelCase(mapProp)}: '${camelCase(mapProp)}-initial-value'`
          )
          .join(', ')
      : ``
  }${stateNamespace ? ` } ` : ``}};
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  ${
    allMappedProps.length
      ? `
    it('maps state and dispatch to props', () => {
      const wrapper = shallow(<${componentName} store={store}/>);
      expect(wrapper.props()).toEqual(
        expect.objectContaining({
          ${allMappedProps
            .map(
              mapProp =>
                `${camelCase(mapProp)}: '${camelCase(mapProp)}-initial-value'`
            )
            .join(', ')}
        })
      );
    });`
      : ``
  }
  ${
    actionCreators.length
      ? `
  ${actionCreators
    .map(
      actionCreator => `  it('maps \`${camelCase(
        actionCreator
      )}\` to dispatch \`${constantCase(actionCreator)}\` action.', () => {
      const ${camelCase(actionCreator)}Value = '${camelCase(
        actionCreator
      )}Value';
      const wrapper = shallow(<${componentName} store={store}/>);
      wrapper.props().${camelCase(actionCreator)}(${camelCase(
        actionCreator
      )}Value);

      expect(store.dispatch).toHaveBeenCalledWith(${camelCase(
        actionCreator
      )}(${camelCase(actionCreator)}Value));
    });`
    )
    .join('\n\n')}`
      : ``
  }
});
`;
};
