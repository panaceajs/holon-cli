const {
  toUpperCaseVariableName,
  toActionStates
} = require('../../utils/strings');

const updateReducerTestsChain = require('../../scaffolding/reducer-tests/update/chain');

exports.command = 'reducer-tests';

exports.describe = 'Update reducer tests';

exports.builder = yargs =>
  yargs
    .option({
      stateNamespace: {
        type: 'string',
        alias: ['s', 'state'],
        describe: `State namespace of combined reducer. Defaults to current directory name`,
        demandOption: true
      },
      actionTypes: {
        type: 'array',
        describe: 'List of actionType:stateProp tuples to map.'
      }
    })
    .coerce({
      name: toUpperCaseVariableName,
      actionTypes: toActionStates
    });

exports.handler = argv => updateReducerTestsChain(argv);
