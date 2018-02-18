module.exports = ({
  component: { componentName, props = [], dispatchProps = [] }
}) => {
  const allProps = [...props, ...dispatchProps];

  return `import React from 'react';
import { shallow } from 'enzyme';
import ${componentName} from '../';

describe('\`${componentName}\` component', () => {
  it('should render properly', () => {
    const wrapper = shallow(<${componentName} />);
    expect(wrapper).toMatchSnapshot();
  });
${allProps
    .map(
      prop => `  it('should set \`${prop}\` prop properly', () => {
    const ${prop}Value = ${
        props.indexOf(prop) !== -1 ? `'${prop} value'` : `() => {}`
      };
    const wrapper = shallow(<${componentName} ${prop}={${prop}Value} />);
    expect(wrapper).toMatchSnapshot();
  });`
    )
    .join('\n\n')}
});
`;
};
