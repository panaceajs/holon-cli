const {
  replace,
  stateNamespace,
  props,
  withContainer,
  mapProps,
  dispatchProps,
  actionTypes,
  withReducer,
  withActionTypes,
  withActions,
  testsOnly
} = require('./helpers/options');
const coerce = require('./helpers/coerce');

const createComponentChain = require('../scaffolding/component/chain');

exports.command = 'component <name>';

exports.describe = 'Create react stateless functional component';

exports.builder = yargs =>
  yargs
    .option({
      replace,
      stateNamespace,
      props,
      mapProps,
      dispatchProps,
      actionTypes,
      withReducer,
      withActionTypes,
      withActions,
      withContainer,
      mui: {
        type: 'boolean',
        describe:
          'Create a material-ui component, wrapped in a `withStyles` hoc.'
      },
      testsOnly
    })
    .example(
      `$ holon create component YourComponent
// creates a component in ./components/YourComponent/index.js
adasd`
    )
    .coerce({
      ...coerce
    });

exports.handler = argv => createComponentChain(argv);
