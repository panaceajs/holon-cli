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
      title:
        'it should add import shallow if describe call is present, should add let mount and beforeEach()',
      fixture: '__fixtures__/with-describe-call.js'
    },
    {
      title:
        'it should add import createMount if describe call is present and withStyles is truthy',
      fixture: '__fixtures__/with-describe-call.js',
      pluginOptions: { withStyles: true }
    },
    {
      title: 'it should not remove existing beforeEach() call',
      fixture: '__fixtures__/with-before-each.js',
      pluginOptions: {}
    },
    {
      title: 'it should not replace existing beforeEach() call',
      fixture: '__fixtures__/with-before-each.js',
      pluginOptions: { withStyles: true }
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
      title: 'it should add tests for props and withStyles is truthy',
      fixture: '__fixtures__/with-before-each.js',
      pluginOptions: { withStyles: true, props: ['first', 'second'] }
    },
    {
      title: 'it should complete tests for props and withStyles is truthy',
      fixture: '__fixtures__/with-before-each-and-prop-tests.js',
      pluginOptions: { withStyles: true, props: ['existing', 'nonExisting'] }
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
    },
    {
      title: 'it should add tests for function props and withStyles is truthy',
      fixture: '__fixtures__/with-before-each.js',
      pluginOptions: {
        withStyles: true,
        dispatchProps: ['doSomething', 'doSomethingElse']
      }
    },
    {
      title:
        'it should complete tests for function props and withStyles is truthy',
      fixture: '__fixtures__/with-before-each-and-prop-tests.js',
      pluginOptions: {
        withStyles: true,
        dispatchProps: ['existingAction', 'nonExistingAction']
      }
    }
  ]
});
