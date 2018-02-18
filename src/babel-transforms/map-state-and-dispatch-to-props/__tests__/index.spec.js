const pluginTester = require('babel-plugin-tester');
const mapStateAndDispatchToPropsTest = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const pluginJsx = require('@babel/plugin-syntax-jsx');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: mapStateAndDispatchToPropsTest,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginJsx, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should add nothing when there is nothing to add.',
      fixture: '__fixtures__/bare-connect.js',
      snapshot: false
    },
    {
      title: 'it should add map state to props.',
      fixture: '__fixtures__/bare-connect.js',
      pluginOptions: {
        mapProps: ['first']
      }
    },
    {
      title: 'it should add map dispatch to props.',
      fixture: '__fixtures__/bare-connect.js',
      pluginOptions: {
        actionTypes: { firstAction: 'first', secondAction: 'second' }
      }
    },
    {
      title: 'it should leverage stateNamespace.',
      fixture: '__fixtures__/bare-connect.js',
      pluginOptions: {
        stateNamespace: 'namespace',
        actionTypes: {
          firstAction: 'first',
          secondAction: 'second'
        }
      }
    }
  ]
});
