const pluginTester = require('babel-plugin-tester');
const containerDispatchTests = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const pluginJsx = require('@babel/plugin-syntax-jsx');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: containerDispatchTests,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginJsx, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should change nothing when there is nothing to change.',
      fixture: '__fixtures__/with-tests.js',
      snapshot: false
    },
    {
      title: 'it should add test case for action types',
      fixture: '__fixtures__/with-tests.js',
      pluginOptions: { actionTypes: { first: 'first' } }
    },
    {
      title: 'it should not overwrite existing test case for action types',
      fixture: '__fixtures__/with-tests.js',
      pluginOptions: {
        actionTypes: { existingAction: 'existingActionValue', first: 'first' }
      }
    }
  ]
});
