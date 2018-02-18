const snapshot = require('../../../../utils/task-snapshot');
const task = require('../chain');

describe('actions update chain', () => {
  describe('`./actions/index.js` does not exist', () => {
    it('should do nothing', async () => {
      await expect(
        snapshot(task, {
          stateNamespace: 'test',
          actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
        })
      ).resolves.toMatchSnapshot();
    });
  });

  // it('should update actions and create action-types when `./actions/index.js` does not exist', async () => {
  //   await expect(
  //     snapshot(task, {
  //       stateNamespace: 'test',
  //       // cwd: resolve(__dirname, '__fixtures__', 'non-existing'),
  //       actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
  //     })
  //   ).resolves.toMatchSnapshot();
  // });
  //
  // it('should complete actions and action types', async () => {
  //   await expect(
  //     snapshot(task, {
  //       withActionTypes: true,
  //       cwd: resolve(__dirname, '__fixtures__', 'existing'),
  //       actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
  //     })
  //   ).resolves.toMatchSnapshot();
  // });
  //
  // it('should complete actions and reducer', async () => {
  //   await expect(
  //     snapshot(task, {
  //       withReducer: true,
  //       cwd: resolve(__dirname, '__fixtures__', 'existing'),
  //       actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
  //     })
  //   ).resolves.toMatchSnapshot();
  // });
  //
  // it('should complete actions, action types and reducer', async () => {
  //   await expect(
  //     snapshot(task, {
  //       withActionTypes: true,
  //       withReducer: true,
  //       cwd: resolve(__dirname, '__fixtures__', 'existing'),
  //       actionTypes: { anAction: 'anAction', anotherAction: 'anotherAction' }
  //     })
  //   ).resolves.toMatchSnapshot();
  // });
});
