const pluginTester = require('babel-plugin-tester');
const componentExample = require('../');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const pluginJsx = require('@babel/plugin-syntax-jsx');
const dynamicImport = require('@babel/plugin-syntax-dynamic-import');

pluginTester({
  filename: __filename,
  plugin: componentExample,
  snapshot: true,
  babelOptions: {
    sourceType: 'module',
    plugins: [dynamicImport, pluginJsx, pluginSyntaxObjectRestSpread]
  },
  tests: [
    {
      title: 'it should add nothing when there is nothing to add.',
      fixture: '__fixtures__/sfc-without-props.js',
      pluginOptions: { componentName: 'ExampleComponent' }
    },
    {
      title:
        'it should change component name of component with holon-component-title class.',
      fixture: '__fixtures__/sfc-without-props-with-title.js',
      pluginOptions: { componentName: 'ExampleComponent' }
    },
    {
      title:
        'it should add props to props list of element with holon-component-props class.',
      fixture: '__fixtures__/sfc-with-props-with-list.js',
      pluginOptions: { componentName: 'ExampleComponent' }
    }
  ]
});
