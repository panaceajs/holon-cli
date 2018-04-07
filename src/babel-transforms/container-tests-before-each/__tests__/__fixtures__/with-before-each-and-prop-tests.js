describe('description', () => {
  it('should set `existing` prop properly', () => {
    const existingValue = 'existing value';
    const wrapper = shallow(<ExampleComponent existing={existingValue}></ExampleComponent>, {
      dive: true
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should set `existingAction` prop properly', () => {
    const existingActionValue = function existingActionFn() {};

    const wrapper = shallow(<ExampleComponent existingAction={existingActionValue}></ExampleComponent>, {
      dive: true, keep: true
    });
    expect(wrapper).toMatchSnapshot();
  });
});
