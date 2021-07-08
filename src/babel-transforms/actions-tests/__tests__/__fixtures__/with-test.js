describe('action creators', () => {
  it('should export `existingAction` function', () => {
    // 
    expect(existingAction).toBeDefined();
    expect(existingAction()).toEqual({
      type: EXISTING_ACTION
    });
  });
});
