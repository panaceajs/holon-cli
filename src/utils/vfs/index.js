const { babel } = require('./ast');
const dest = require('./dest');
const template = require('./template');
const conflict = require('./conflict');

module.exports = {
  babel,
  dest,
  template,
  conflict
};
