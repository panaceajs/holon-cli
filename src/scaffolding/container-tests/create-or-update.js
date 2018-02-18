const exists = require('../../utils/exists');
const create = require('./create');
const update = require('./update');

module.exports = ({ cwd, name }) =>
  exists(`containers/${name}/__tests__/index.spec.js`, cwd) ? update : create;
