const src = require('vinyl-fs/lib/src');
const symlink = require('vinyl-fs/lib/symlink');
const through2 = require('through2');
const { basename, resolve } = require('path');

function dest(target, { cwd = process.cwd() } = {}) {
  return through2.obj(function through2Obj(file, encoding, cb) {
    try {
      file.path = resolve(cwd, target, basename(file.path));
      this.push(file);
    } catch (err) {
      this.emit('error', new Error(err));
    }
    cb();
  });
}
module.exports = {
  src,
  dest,
  symlink
};
