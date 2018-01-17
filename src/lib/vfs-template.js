const PluginError = require('plugin-error');
const through = require('through2');
const merge = require('lodash.merge');
const template = require('lodash.template');
const { Buffer } = require('safe-buffer');

function compile(options, data, render) {
  return through.obj(function templateThrough(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('gulp-template', 'Streaming not supported'));
      return;
    }

    try {
      const tpl = template(file.contents.toString(), options);
      file.contents = Buffer.from(
        render ? tpl(merge({}, file.data, data)) : tpl.toString()
      );
      this.push(file);
    } catch (err) {
      this.emit(
        'error',
        new PluginError('vfs-template', err, { fileName: file.path })
      );
    }

    cb();
  });
}

module.exports = (data, options) => compile(options, data, true);
module.exports.precompile = options => compile(options);
