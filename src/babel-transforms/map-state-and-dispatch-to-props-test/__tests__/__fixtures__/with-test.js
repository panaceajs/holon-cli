describe('', () => {
  it('maps state and dispatch to props', () => {
    const wrapper = shallow(<Component store={store} />, {
      dive: true
    });

    // 
    expect(wrapper.props()).toEqual(expect.objectContaining({
      existingAction: 'existingActionValue',
      existingProp: 'existingPropShouldNotChange'
    }));
  });
});
