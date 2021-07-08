const { resolve } = require('path');
const fileExists = require('file-exists');

module.exports = (dest, cwd = process.cwd()) =>
  fileExists.sync(resolve(cwd, dest));
