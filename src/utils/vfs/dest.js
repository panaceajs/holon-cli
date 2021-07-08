const { highlightAuto } = require('emphasize');
const through = require('through2');
const { basename, relative, resolve } = require('path');
const conflict = require('./conflict');
const colors = require('ansi-colors');
const vfs = require('vinyl-fs');
const chalk = require('chalk');

const compose = (s1, s2) => {
  s1.pipe(s2);
  s1.pipe = dest => s2.pipe(dest);
  s1.unpipe = dest => s2.unpipe(dest);
  return s1;
};

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
${
              highlightAuto(String(file.contents), {
                attr: chalk.hex('#1f8181'),
                keyword: chalk.hex('#1f8181'),
                'function keyword': chalk.hex('#f2bc79'),
                name: chalk.hex('#f2bc79'),
                'function title': chalk.hex('#f28972'),
                comment: chalk.hex('#7a7267'),
                doctag: chalk.hex('#a0988e'),
                string: chalk.hex('#f8bb39'),
                symbol: chalk.hex('#f8bb39'),
                literal: chalk.hex('#f8bb39'),
                number: chalk.hex('#f8bb39')
              }).value
            }`
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

  return compose(conflict(target, options), vfs.dest(target, options));
};
