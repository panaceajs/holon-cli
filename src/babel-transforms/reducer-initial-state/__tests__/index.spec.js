const pluginTester = require('babel-plugin-tester');
const reducerInitialState = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: reducerInitialState,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title:
        'it should add action types to new state namespace in case of variable assignment',
      fixture: '__fixtures__/with-assignment.js',
      pluginOptions: {
        actionTypes: { foo: 'foo' },
        stateNamespace: 'nonExistingNamespace',
        stateKey: 'state'
      }
    },
    {
      title:
        'it should complete action types to existing state namespace in case of variable assignment',
      fixture: '__fixtures__/with-assignment.js',
      pluginOptions: {
        actionTypes: { foo: 'foo', existing: 'existing' },
        stateNamespace: 'existingNamespace',
        stateKey: 'state'
      }
    }
  ]
});
