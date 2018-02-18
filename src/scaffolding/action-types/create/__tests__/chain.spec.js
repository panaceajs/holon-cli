const { resolve } = require('path');
const snapshot = require('../../../../utils/task-snapshot');
const task = require('../chain');

describe('action-types', () => {
  it('should create action types with tests in `action-types`', async () => {
    await expect(
      snapshot(task, {
        stateNamespace: 'test',
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
  it('should create action types and actions with tests', async () => {
    await expect(
      snapshot(task, {
        magic: true,
        stateNamespace: 'test',
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
  it('should create action types and actions with tests in `my-dir`', async () => {
    await expect(
      snapshot(task, {
        cwd: resolve('other-dir'),
        magic: true,
        stateNamespace: 'test',
        actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
      })
    ).resolves.toMatchSnapshot();
  });
});
