const pluginTester = require('babel-plugin-tester');
const componentTests = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const pluginJsx = require('@babel/plugin-syntax-jsx');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: componentTests,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginJsx, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should change nothing when there is nothing to change.',
      fixture: '__fixtures__/without-describe-call.js',
      snapshot: false
    },
    {
      title: 'it should add tests for props',
      fixture: '__fixtures__/with-before-each.js',
      pluginOptions: { props: ['first', 'second'] }
    },
    {
      title: 'it should add tests for props',
      fixture: '__fixtures__/with-before-each.js',
      pluginOptions: { props: ['first', 'second'] }
    },
    {
      title: 'it should complete tests for props',
      fixture: '__fixtures__/with-before-each-and-prop-tests.js',
      pluginOptions: { props: ['existing', 'nonExisting'] }
    },
    {
      title: 'it should add tests for function props',
      fixture: '__fixtures__/with-before-each.js',
      pluginOptions: { dispatchProps: ['doSomething', 'doSomethingElse'] }
    },
    {
      title: 'it should complete tests for function props',
      fixture: '__fixtures__/with-before-each-and-prop-tests.js',
      pluginOptions: { dispatchProps: ['existingAction', 'nonExistingAction'] }
    }
  ]
});
