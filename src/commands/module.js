const {
  replace,
  stateNamespace,
  actionTypes,
  mapProps,
  magic,
  withActions,
  withActionTypes,
  withContainer,
  withComponent,
  withReducer,
  testsOnly
} = require('./helpers/options');
const coerce = require('./helpers/coerce');

const moduleChain = require('../scaffolding/module/chain');

exports.command = 'module';

exports.describe = 'Create a holon module';

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
      withContainer,
      withComponent,
      withReducer,
      testsOnly
    })
    .coerce({
      ...coerce
    });

exports.handler = argv => moduleChain(argv);
