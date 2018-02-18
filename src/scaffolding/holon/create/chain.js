const merge2 = require('merge2');

const createHolon = require('./');
const createOrUpdateActionTypes = require('../../action-types/create-or-update');
const createOrUpdateActionTypesTests = require('../../action-types-tests/create-or-update');
const createOrUpdateActions = require('../../actions/create-or-update');
const createOrUpdateActionsTests = require('../../actions-tests/create-or-update');
const createOrUpdateLayout = require('../../layout/create-or-update');
const createOrUpdateReducer = require('../../reducer/create-or-update');
const createOrUpdateReducerTests = require('../../reducer-tests/create-or-update');
const createOrUpdateComponent = require('../../component/create-or-update');
const createOrUpdateComponentTests = require('../../component-tests/create-or-update');
const createOrUpdateContainer = require('../../container/create-or-update');
const createOrUpdateContainerTests = require('../../container-tests/create-or-update');

module.exports = originalArgv => {
  const {
    actionTypes = {},
    mapProps = [],
    testsOnly,
    magic,
    dispatchOnMount = {},
    withLayout,
    withActions,
    withActionTypes,
    withReducer,
    withComponent,
    withContainer,
    componentName
  } = originalArgv;

  const allActionTypes = { ...dispatchOnMount, ...actionTypes };
  const argv = {
    ...originalArgv,
    name: componentName,
    props: [...Object.values(allActionTypes), ...mapProps],
    dispatchProps: Object.keys(allActionTypes)
  };
  const tasks = [];

  if (!testsOnly) {
    tasks.push(createHolon);
  }

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
  if (magic || withLayout) {
    if (!testsOnly) {
      tasks.push(createOrUpdateLayout(argv));
    }
    tasks.push(createOrUpdateReducerTests(argv));
  }
  if (magic || withComponent) {
    if (!testsOnly) {
      tasks.push(createOrUpdateComponent(argv));
    }
    tasks.push(createOrUpdateComponentTests(argv));
  }
  if (magic || withContainer) {
    if (!testsOnly) {
      tasks.push(createOrUpdateContainer(argv));
    }
    tasks.push(createOrUpdateContainerTests(argv));
  }
  return merge2(tasks.map(task => task(argv)));
};
