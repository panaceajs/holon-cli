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
      title: 'it should change nothing when there is nothing to change.',
      fixture: '__fixtures__/with-variable-declaration.js',
      snapshot: false
    },
    {
      title:
        'it should add action types to new state namespace in case of variable assignment',
      fixture: '__fixtures__/with-variable-declaration.js',
      pluginOptions: {
        actionTypes: { foo: 'foo' },
        stateNamespace: 'nonExistingNamespace',
        variableName: 'initialState'
      }
    },
    {
      title:
        'it should add action types to existing state namespace in case of variable assignment',
      fixture: '__fixtures__/with-variable-declaration.js',
      pluginOptions: {
        actionTypes: { foo: 'foo' },
        stateNamespace: 'existingNamespace',
        variableName: 'initialState'
      }
    },
    {
      title:
        'it should complete action types to existing state namespace in case of variable assignment',
      fixture: '__fixtures__/with-variable-declaration.js',
      pluginOptions: {
        actionTypes: { foo: 'foo', existing: 'existing' },
        stateNamespace: 'existingNamespace',
        variableName: 'initialState'
      }
    },
    {
      title:
        'it should complete action types to new state namespace in case of variable assignment',
      fixture: '__fixtures__/with-variable-declaration.js',
      pluginOptions: {
        actionTypes: { foo: 'foo', existing: 'existing' },
        stateNamespace: 'existingNamespace',
        variableName: 'initialState'
      }
    },
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
    // {
    //   title: 'it should update case and update type import.',
    //   fixture: '__fixtures__/with-cases.js',
    //   pluginOptions: {
    //     actionTypes: { foo: 'foo', doSomething: 'someValue' }
    //   }
    // }
    // ,
    // {
    //   title: 'it should add action creator exports.',
    //   fixture: '__fixtures__/without-exports.js',
    //   pluginOptions: {
    //     targetPath: '../../actions',
    //     actionTypes: { foo: 'foo' }
    //   }
    // },
    // {
    //   title: 'it should update action creator exports.',
    //   fixture: '__fixtures__/with-exports.js',
    //   pluginOptions: {
    //     targetPath: '../actions',
    //     actionTypes: {
    //       existingAction: 'existingAction',
    //       nonExistingAction: 'nonExistingAction'
    //     }
    //   }
    // }
  ]
});
