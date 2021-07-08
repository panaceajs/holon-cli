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

const reducerChain = require('../scaffolding/nextjs-page/chain');

exports.command = 'nextjs-page';

exports.describe = 'Create next.js page';

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

exports.handler = argv => reducerChain(argv);
