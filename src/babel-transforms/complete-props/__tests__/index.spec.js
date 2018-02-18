const pluginTester = require('babel-plugin-tester');
const completeProps = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const pluginJsx = require('@babel/plugin-syntax-jsx');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: completeProps,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginJsx, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should add nothing when there is nothing to add.',
      fixture: '__fixtures__/sfc-without-existing-props.js',
      pluginOptions: {}
    },
    {
      title: 'it should add props.',
      fixture: '__fixtures__/sfc-without-existing-props.js',
      pluginOptions: { props: ['first', 'second'] }
    },
    {
      title: 'it should add prop functions.',
      fixture: '__fixtures__/sfc-without-existing-props.js',
      pluginOptions: { dispatchProps: ['doSomething', 'doSomethingElse'] }
    },
    {
      title: 'it should not overwrite existing props.',
      fixture: '__fixtures__/sfc-with-existing-props.js',
      pluginOptions: { props: ['existing', 'nonExisting'] }
    },
    {
      title: 'it should not overwrite existing prop functions.',
      fixture: '__fixtures__/sfc-with-existing-props.js',
      pluginOptions: { dispatchProps: ['existingDoSomething'] }
    },
    {
      title: 'it should set both props and prop functions.',
      fixture: '__fixtures__/sfc-with-existing-props.js',
      pluginOptions: {
        props: ['existing', 'non-existing'],
        dispatchProps: ['existingDoSomething', 'nonExistingDoSomething']
      }
    },
    {
      title:
        'it should rename given props to variable names and remove duplicates.',
      fixture: '__fixtures__/sfc-without-existing-props.js',
      pluginOptions: {
        props: [
          'this is a var',
          'this_is_a_var',
          'thisIsAVar',
          'this_is_another_var',
          'this.also'
        ],
        dispatchProps: [
          'existingDoSomething',
          'nonExistingDoSomething',
          'this is a var',
          'this_is_a_var_',
          'this_is_a_var_1'
        ]
      }
    }
  ]
});
