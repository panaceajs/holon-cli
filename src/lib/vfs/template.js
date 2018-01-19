const through = require('through2');

module.exports = data =>
  through.obj((file, encoding, callback) => {
    file.contents = new Buffer(require(file.path)(data));
    callback(null, file);
  });
