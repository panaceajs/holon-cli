const { resolve } = require('path');
const snapshot = require('../../../utils/task-snapshot');
const task = require('../');

describe('actions', () => {
  it('should create action types in `actions/index.js`', async () => {
    await expect(
      snapshot(task, {
        create: true,
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });

  it('should add import action types statmenett`', async () => {
    await expect(
      snapshot(task, {
        cwd: resolve(__dirname, '__fixtures__/without-action-type-import'),
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
  it('should add import action types statmenett`', async () => {
    await expect(
      snapshot(task, {
        cwd: resolve(__dirname, '__fixtures__/with-action-type-import'),
        actionTypes: { existingAction: 'existingAction' }
      })
    ).resolves.toMatchSnapshot();
  });
});
