# Components

Create and updates React stateless function components, and its tests.

## Create

### Without props

We can create a bare component with tests by calling the following command:
```
$ holon create component YourComponent
```

This will create a component in `components/YourComponent/index.js`.

```
import React from 'react';

export default () => (
  <div>
    <h2 className="holon-component-title">YourComponent</h2>
    <ul className="holon-component-props" />
  </div>
);
```

To make life easier it will also create a Jest snapshot test in `components/YourComponent/__tests__/index.spec.js`.

```
import React from 'react';
import { shallow } from 'enzyme';
import YourComponent from '../';

describe('`YourComponent` component', () => {
  it('should render properly', () => {
    const wrapper = shallow(<YourComponent />);
    expect(wrapper).toMatchSnapshot();
  });
});
```

### With props

You can add props by using the `--props` flag.

```
$ holon create component ComponentWithProps --props first, second, third
```

In `components/ComponentWithProps/index.js` a new component is created with props, listing the props.

```
import React from 'react';

export default ({ first, second, third }) => (
  <div>
    <h2 className="holon-component-title">ComponentWithProps</h2>
    <ul className="holon-component-props">
      <li>first: {first}</li>
      <li>second: {second}</li>
      <li>third: {third}</li>
    </ul>
  </div>
);
```

This command will also create tests for your props.

```
import React from 'react';
import { shallow } from 'enzyme';
import ComponentWithProps from '../';

describe('`ComponentWithProps` component', () => {
  it('should render properly', () => {
    const wrapper = shallow(<ComponentWithProps />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should set `first` prop properly', () => {
    const firstValue = 'first value';
    const wrapper = shallow(<ComponentWithProps first={firstValue} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should set `second` prop properly', () => {
    const secondValue = 'second value';
    const wrapper = shallow(<ComponentWithProps second={secondValue} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should set `third` prop properly', () => {
    const thirdValue = 'third value';
    const wrapper = shallow(<ComponentWithProps third={thirdValue} />);
    expect(wrapper).toMatchSnapshot();
  });
});
```

### With dispatch props

Since we're using redux as well, we will encounter prop functions as well. To create one or more prop functions, use the `--dispatchProps` option.

```
$ holon create component ComponentWithDispatchProps --dispatchProps doSomething, loadStuff
```

This component below in `./components/ComponentWithDispatchProps/index.js` lists the dispatch props as buttons, and will call the functions when clicked.

```
import React from 'react';

export default ({ doSomething = () => {}, loadStuff = () => {} }) => (
  <div>
    <h2 className="holon-component-title">ComponentWithDispatchProps</h2>
    <ul className="holon-component-props">
      <li>
        <button type="button" onClick={() => doSomething()}>
          doSomething
        </button>
      </li>
      <li>
        <button type="button" onClick={() => loadStuff()}>
          loadStuff
        </button>
      </li>
    </ul>
  </div>
);
```

### With regular and dispatch props

We can also combine `--props` and `--dispatchProps`, which will result in a combination of the two examples above.

```
$ holon create ComponentWithRegularAndDispatchProps --props first --dispatchProps doSomething
```

This will create a new component in `./components/ComponentWithRegularAndDispatchProps/index.js`.

```
import React from 'react';

export default ({ first, doSomething = () => {} }) => (
  <div>
    <h2 className="holon-component-title">
      ComponentWithRegularAndDispatchProps
    </h2>
    <ul className="holon-component-props">
      <li>first: {first}</li>
      <li>
        <button type="button" onClick={() => doSomething()}>
          doSomething
        </button>
      </li>
    </ul>
  </div>
);
```

Tests for this component can be found in `./components/ComponentWithRegularAndDispatchProps/__tests__/index.spec.js`.

```
import React from 'react';
import { shallow } from 'enzyme';
import ComponentWithDispatchProps from '../';

describe('`ComponentWithDispatchProps` component', () => {
  it('should render properly', () => {
    const wrapper = shallow(<ComponentWithDispatchProps />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should set `doSomething` prop properly', () => {
    const wrapper = shallow(
      <ComponentWithDispatchProps doSomething={() => {}} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should set `loadStuff` prop properly', () => {
    const wrapper = shallow(
      <ComponentWithDispatchProps loadStuff={() => {}} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});

```
