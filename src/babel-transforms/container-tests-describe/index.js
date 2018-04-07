const babelTemplate = require('@babel/template').default;
const { findCallExpression } = require('../utils');

const buildDescribe = babelTemplate(
  `describe(DESCRIPTION, () => {

});`,
  {
    sourceType: 'module',
    plugins: ['dynamicImport', 'pluginJsx', 'pluginSyntaxObjectRestSpread']
  }
);

module.exports = ({ types: t }) => ({
  name: 'holon-container-tests-describe',
  visitor: {
    Program(path, { opts: { name } }) {
      const describeCallExpression = findCallExpression(path, 'describe');

      if (describeCallExpression) {
        const describeDescription = describeCallExpression.get('arguments.0');
        if (
          describeDescription &&
          describeDescription.get('value') &&
          describeDescription.get('value').node.indexOf('container') !== -1
        ) {
          describeDescription.set('value', `\`${name}\` container`);
        }
      } else {
        path.pushContainer(
          'body',
          buildDescribe({ DESCRIPTION: `'\`${name}\` container'` })
        );
      }
    }
  }
});
