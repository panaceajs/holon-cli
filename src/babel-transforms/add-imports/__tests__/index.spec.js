const pluginTester = require('babel-plugin-tester');
const actionCreatorsImports = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: actionCreatorsImports,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should add nothing when there is nothing to add.',
      fixture: '__fixtures__/without-imports.js',
      snapshot: false
    },
    {
      title: 'it should add action creator import.',
      fixture: '__fixtures__/without-imports.js',
      pluginOptions: {
        imports: { foo: ['first', 'second', { default: 'all' }] }
      }
    }
    // {
    //   title: 'it should add action creator import to targetPath',
    //   fixture: '__fixtures__/without-imports.js',
    //   pluginOptions: {
    //     targetPath: '../../actions',
    //     actionTypes: { foo: 'foo' }
    //   }
    // },
    // {
    //   title: 'it should update action creator import',
    //   fixture: '__fixtures__/with-imports.js',
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
