module.exports = ({
  component: { componentName, props = [], dispatchProps = [] }
}) => {
  const allProps = [...props, ...dispatchProps];

  return `import React from 'react';
import { createShallow, getClasses } from 'material-ui/test-utils';
import ${componentName} from '../';

describe('\`${componentName}\` component', () => {
  let shallow;
  let classes;

  beforeEach(() => {
    shallow = createShallow({ untilSelector: '${componentName}' });
    classes = getClasses(<${componentName} />);
  });

  it('should render properly', () => {
    const wrapper = shallow(<${componentName} />);
    expect(wrapper).toMatchSnapshot();
    Object.keys(classes).forEach(className => {
      // failing tests indicate that a class declared in \`styles\` is not used.
      expect(
        wrapper.find(\`.\${classes[className]}\`).length
      ).toBeGreaterThanOrEqual(1);
    });
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
