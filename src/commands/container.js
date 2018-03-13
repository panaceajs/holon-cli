const {
  replace,
  stateNamespace,
  actionTypes,
  mapProps,
  magic,
  withActions,
  withActionTypes,
  withComponent,
  withReducer,
  testsOnly
} = require('./helpers/options');
const coerce = require('./helpers/coerce');

const createContainerChain = require('../scaffolding/container/chain');

exports.command = 'container <name>';

exports.describe =
  'Create react redux container. Creates missing action types and action creators, creates missing reducer cases. Will create action types, actions and reducer if need be.';

exports.builder = yargs =>
  yargs
    .option({
      replace,
      stateNamespace,
      actionTypes,
      mapProps,
      magic,
      withActions,
      withActionTypes,
      withComponent,
      withReducer,
      testsOnly
    })
    .coerce({
      ...coerce
    });

exports.handler = argv => createContainerChain(argv);
