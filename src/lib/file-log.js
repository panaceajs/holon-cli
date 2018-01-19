const { yellow } = require('ansi-colors');
const map = require('map-stream');
const path = require('path');

const fileLog = (format = v => v, filenameFormat = v => v) =>
  map((file, cb) => {
    const filepath = filenameFormat(path.relative(process.cwd(), file.path));

    console.log(format(filepath));

    return cb(null, file);
  });

module.exports.fileLog = fileLog;
module.exports.fancyFileLog = (format = v => `✍️  Created ${v}`) =>
  fileLog(format, v => yellow(v));
