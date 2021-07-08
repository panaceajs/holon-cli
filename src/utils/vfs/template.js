/* eslint no-param-reassign: 0, global-require: 0, import/no-dynamic-require: 0 */
const through = require('through2');
const { resolve } = require('path');

module.exports = function throughTemplate(data) {
  return through.obj(function t2(file, encoding, callback) {
    try {
      const template = require(resolve(file.path));
      file.contents = new Buffer(template(data));
    } catch (err) {
      this.emit('error', new Error(err));
    }
    callback(null, file);
  });
};
