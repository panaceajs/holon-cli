const merge2 = require('merge2');

const updateContainer = require('./');
const createOrUpdateContainerTests = require('../../container-tests/create-or-update');
const createOrUpdateActionTypes = require('../../action-types/create-or-update');
const createOrUpdateActionTypesTests = require('../../action-types-tests/create-or-update');
const createOrUpdateActions = require('../../actions/create-or-update');
const createOrUpdateActionsTests = require('../../actions-tests/create-or-update');
const createOrUpdateReducer = require('../../reducer/create-or-update');
const createOrUpdateReducerTests = require('../../reducer-tests/create-or-update');
const createOrUpdateComponent = require('../../component/create-or-update');
const createOrUpdateComponentTests = require('../../component-tests/create-or-update');

module.exports = argv => {
  const {
    actionTypes = {},
    mapProps = [],
    testsOnly,
    magic,
    withActions,
    withActionTypes,
    withReducer,
    withComponent
  } = argv;
  const tasks = [];

  if (!testsOnly) {
    tasks.push(updateContainer);
  }

  tasks.push(createOrUpdateContainerTests(argv));

  if (magic || withActions) {
    if (!testsOnly) {
      tasks.push(createOrUpdateActions(argv));
    }
    tasks.push(createOrUpdateActionsTests(argv));
  }

  if (magic || withActionTypes) {
    if (!testsOnly) {
      tasks.push(createOrUpdateActionTypes(argv));
    }

    tasks.push(createOrUpdateActionTypesTests(argv));
  }

  if (magic || withReducer) {
    if (!testsOnly) {
      tasks.push(createOrUpdateReducer(argv));
    }
    tasks.push(createOrUpdateReducerTests(argv));
  }

  if (magic || withComponent) {
    if (!testsOnly) {
      tasks.push(createOrUpdateComponent(argv));
    }
    tasks.push(createOrUpdateComponentTests(argv));
  }

  return merge2(
    tasks.map(task =>
      task({
        ...argv,
        props: [...Object.values(actionTypes), ...mapProps],
        dispatchProps: Object.keys(actionTypes)
      })
    )
  );
};
