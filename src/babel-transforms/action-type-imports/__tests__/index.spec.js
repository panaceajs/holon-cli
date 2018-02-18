const pluginTester = require('babel-plugin-tester');
const actionTypeImports = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: actionTypeImports,
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
      title: 'it should add action types import.',
      fixture: '__fixtures__/without-imports.js',
      pluginOptions: { actionTypes: { foo: 'foo' } }
    },
    {
      title: 'it should add action types import to targetPath',
      fixture: '__fixtures__/without-imports.js',
      pluginOptions: {
        targetPath: '../../actions-types',
        actionTypes: { foo: 'foo' }
      }
    }
  ]
});
