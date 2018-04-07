const pluginTester = require('babel-plugin-tester');
const containerDefaultExport = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: containerDefaultExport,
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
    },
    {
      title: 'it should add default export.',
      fixture: '__fixtures__/without-default-export.js'
    }
  ]
});
