const pluginTester = require('babel-plugin-tester');
const reducerTests = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: reducerTests,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should change nothing when there is nothing to change.',
      fixture: '__fixtures__/without-describe-call.js',
      snapshot: false
    },
    {
      title: 'it should add tests for cases',
      fixture: '__fixtures__/with-describe-call.js',
      pluginOptions: { actionTypes: { doSomething: 'doSomething' } }
    },
    {
      title: 'it should update tests for cases',
      fixture: '__fixtures__/with-test.js',
      pluginOptions: {
        actionTypes: {
          doSomethingExisting: 'somethingExistingValue',
          doSomething: 'doSomething'
        }
      }
    }
  ]
});
