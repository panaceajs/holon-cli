const pluginTester = require('babel-plugin-tester');
const actionTypesTests = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: actionTypesTests,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should change nothing when there is nothing to change.',
      fixture: '__fixtures__/missing-describe-call.js',
      snapshot: false
    },
    {
      title: 'it should add tests for action types',
      fixture: '__fixtures__/with-describe-call.js',
      pluginOptions: { actionTypes: { doSomething: 'doSomething' } }
    },
    {
      title: 'it should complete tests for action types',
      fixture: '__fixtures__/with-test.js',
      pluginOptions: {
        actionTypes: {
          existingAction: 'existingAction',
          nonExistingAction: 'nonExistingAction'
        }
      }
    }
  ]
});
