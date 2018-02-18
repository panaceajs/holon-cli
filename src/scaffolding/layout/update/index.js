const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { dest } = require('../../../utils/vfs');
// const { babel } = require('../../../utils/vfs');

const { resolve } = require('path');
// const completeProps = require('../../../babel-transforms/complete-props');
// const componentExample = require('../../../babel-transforms/component-example');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  holonName,
  componentName
}) =>
  vfs
    .src('index.js', {
      cwd: resolve(cwd, 'layouts', `${holonName}Layout`, 'index.js'),
      allowEmpty: true
    })
    // .pipe(
    //   babel({
    //     sourceType: 'module',
    //     plugins: [
    //       [
    //         componentExample,
    //         {
    //           holonName,
    //           withComponent,
    //           componentName
    //         }
    //       ]
    //     ]
    //   })
    // )
    .pipe(eslint({ fix: true }))
    .pipe(
      dest(`./components/${componentName}`, {
        cwd,
        logger,
        dryRun
      })
    );
