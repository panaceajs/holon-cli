const through2 = require('through2');
const babelCore = require('@babel/core');
const pluginSyntaxObjectRestSpread = require('@babel/plugin-syntax-object-rest-spread');
const pluginJsx = require('@babel/plugin-syntax-jsx');

exports.babel = function babel(options = {}) {
  return through2.obj(function through2Obj(file, encoding, cb) {
    try {
      const { code } = babelCore.transform(String(file.contents), {
        retainLines: false,
        ...options,
        plugins: [pluginSyntaxObjectRestSpread, pluginJsx, ...options.plugins]
      });

      // eslint-disable-next-line
      file.contents = new Buffer(
        code
      );
      this.push(file);
    } catch (err) {
      console.error(err);
      this.emit('error', new Error(err));
    }
    return cb();
  });
};
