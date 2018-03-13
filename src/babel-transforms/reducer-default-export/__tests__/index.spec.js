const pluginTester = require('babel-plugin-tester');
const reducerDefaultExport = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: reducerDefaultExport,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should add nothing when there is nothing to add.',
      fixture: '__fixtures__/with-default-export.js',
      snapshot: false
    }
    // ,
    // {
    //   title: 'it should add case and add type import.',
    //   fixture: '__fixtures__/without-cases.js',
    //   pluginOptions: { actionTypes: { foo: 'foo' } }
    // },
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
