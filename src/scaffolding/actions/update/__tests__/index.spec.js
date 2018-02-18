const { resolve } = require('path');
const snapshot = require('../../../../utils/task-snapshot');
const task = require('../');

describe('actions update', () => {
  it('should create actions', async () => {
    await expect(
      snapshot(task, {
        cwd: resolve(__dirname, '__fixtures__', 'non-existing'),
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
  it('should complete actions', async () => {
    await expect(
      snapshot(task, {
        cwd: resolve(__dirname, '__fixtures__', 'existing'),
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
});
