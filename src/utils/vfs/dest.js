const { highlight } = require('cardinal');
const through = require('through2');
const { basename, relative, resolve } = require('path');
const conflict = require('./conflict');
const colors = require('ansi-colors');

module.exports = function throughTemplate(target, options = {}) {
  const {
    cwd = process.cwd(),
    logger: { info = console.log.bind(console) } = {},
    dryRun
  } = options;

  if (process.env.NODE_ENV === 'test' || dryRun) {
    return through.obj(function t2(file, encoding, callback) {
      if (process.env.NODE_ENV !== 'test' && dryRun) {
        try {
          const relativeTarget = `./${relative(
            cwd,
            resolve(target, basename(file.path))
          )}`;
          info(
            `${colors.white(`✍️  ${relativeTarget}`)}
${highlight(String(file.contents))}`
          );
        } catch (err) {
          this.emit('error', new Error(err));
        }
      } else {
        /* eslint no-param-reassign: 0 */
        file.path = resolve(cwd, target, basename(file.path));
      }
      callback(null, file);
    });
  }
  return conflict(target, options);
};
