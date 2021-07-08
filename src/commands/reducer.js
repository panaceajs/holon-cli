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
  testsOnly
} = require('./helpers/options');
const coerce = require('./helpers/coerce');

const reducerChain = require('../scaffolding/reducer/chain');

exports.command = 'reducer';

exports.describe = 'Create reducer and tests';

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
      testsOnly
    })
    .coerce({
      ...coerce
    });

exports.handler = argv => reducerChain(argv);
