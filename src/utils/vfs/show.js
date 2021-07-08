const through2 = require('through2');

module.exports = function show() {
  return through2.obj(function through2Obj(file, encoding, cb) {
    console.log(file.path);
    console.log(String(file.contents));
    this.push(file);
    return cb();
  });
};
