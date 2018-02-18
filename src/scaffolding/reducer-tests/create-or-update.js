const exists = require('../../utils/exists');
const create = require('./create');
const update = require('./update');

module.exports = ({ cwd }) =>
  exists('store/__tests__/reducer.spec.js', cwd) ? update : create;
