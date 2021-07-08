const {
  replace,
  stateNamespace,
  actionTypes,
  testsOnly,
  magic,
  withActionTypes,
  withReducer,
  withContainer,
  withComponent
} = require('./helpers/options');
const coerce = require('./helpers/coerce');

const actionChain = require('../scaffolding/actions/chain');

exports.command = 'actions';

exports.describe = 'Creates action types and tests.';

exports.builder = yargs =>
  yargs
    .option({
      replace,
      stateNamespace,
      actionTypes,
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
