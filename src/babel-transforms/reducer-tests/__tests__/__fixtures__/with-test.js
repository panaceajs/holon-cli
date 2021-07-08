describe('reducer', () => {
  it('should handle `DO_SOMETHING_EXISTING`', () => {
    const next = reducer(undefined, doSomethingExisting());
    expect(next).toMatchSnapshot();
    const next2 = reducer(next, doSomething('do-something-existing-unit-test-payload'));
    expect(next2).toMatchSnapshot();
  });
});
