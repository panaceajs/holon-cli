const {
  replace,
  stateNamespace,
  actionTypes,
  magic,
  withActionTypes,
  withReducer,
  withComponent,
  withContainer,
  testsOnly
} = require('./helpers/options');
const coerce = require('./helpers/coerce');

const actionChain = require('../scaffolding/action-types/chain');

exports.command = 'action-types';

exports.describe = 'Creates action types and tests.';

exports.builder = yargs =>
  yargs
    .option({
      replace,
      stateNamespace,
      actionTypes: { ...actionTypes, demandOption: true },
      magic,
      withActionTypes,
      withReducer,
      withContainer,
      withComponent,
      testsOnly
    })
    .coerce({
      ...coerce
    });

exports.handler = argv => actionChain(argv);
