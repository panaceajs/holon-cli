const vfs = require('vinyl-fs');
const eslint = require('gulp-eslint');
const defaultLogger = require('../../../utils/logger');
const { template, dest } = require('../../../utils/vfs');

module.exports = ({
  cwd = process.cwd(),
  logger = { ...defaultLogger },
  dryRun,
  actionTypes = {}
}) => {
  console.log(cwd);
  return vfs
    .src('./templates/*.js', {
      cwd: __dirname
    })
    .pipe(
      template({
        actions: {
          actionTypes
        }
      })
    )
    .pipe(eslint({ fix: true }))
    .pipe(dest(`./action-types`, { cwd, logger, dryRun }));
};
