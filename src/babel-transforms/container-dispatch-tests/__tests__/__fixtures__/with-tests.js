describe('`ExampleComponent` component', () => {
  it('maps `existingAction` to dispatch `EXISTING_ACTION` action.', () => {
    // should not be modified by transform
    const existingActionValue = 'existingActionValue';
    const wrapper = shallow(<ExampleComponent store={store} />);
    wrapper.props().existingAction(existingActionValue);
    expect(store.dispatch).toHaveBeenCalledWith(existingAction(existingActionValue));

    // do other stuff
  });

  it('should be ignored by transform', () => {});

  it('does nothing');
});

describe('`Some` component');
