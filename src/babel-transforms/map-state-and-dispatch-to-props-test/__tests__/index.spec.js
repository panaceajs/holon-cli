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
      title: 'it should change nothing when there is nothing to change.',
      fixture: '__fixtures__/with-test.js',
      snapshot: false
    },
    {
      title: 'it should add prop function tests.',
      fixture: '__fixtures__/with-test.js',
      pluginOptions: {
        actionTypes: {
          nonExistingAction: 'nonExistingActionValue'
        }
      }
    },
    {
      title: 'it should complete prop function tests.',
      fixture: '__fixtures__/with-test.js',
      pluginOptions: {
        actionTypes: {
          nonExistingAction: 'nonExistingActionValue',
          existingAction: 'existingActionValue'
        }
      }
    },
    {
      title: 'it should add prop tests.',
      fixture: '__fixtures__/with-test.js',
      pluginOptions: {
        mapProps: ['nonExistingProp']
      }
    },

    {
      title: 'it should complete prop tests.',
      fixture: '__fixtures__/with-test.js',
      pluginOptions: {
        mapProps: ['nonExistingProp', 'existingProp']
      }
    }
    // {
    //   title:
    //     'it should add action types to new state namespace in case of variable assignment',
    //   fixture: '__fixtures__/with-test.js',
    //   pluginOptions: {
    //     actionTypes: { foo: 'foo' },
    //     stateNamespace: 'nonExistingNamespace',
    //     variableName: 'initialState'
    //   }
    // }
  ]
});
