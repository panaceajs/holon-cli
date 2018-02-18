const pluginTester = require('babel-plugin-tester');
const actionTypes = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: actionTypes,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should add nothing when there is nothing to add.',
      fixture: '__fixtures__/without-exports.js',
      snapshot: false
    },
    {
      title: 'it should add action type exports.',
      fixture: '__fixtures__/without-exports.js',
      pluginOptions: { actionTypes: { someAction: 'someAction' } }
    },
    {
      title: 'it should update action type exports.',
      fixture: '__fixtures__/with-exports.js',
      pluginOptions: {
        actionTypes: {
          existingAction: 'existingAction',
          nonExistingAction: 'nonExistingAction'
        }
      }
    }
  ]
});
