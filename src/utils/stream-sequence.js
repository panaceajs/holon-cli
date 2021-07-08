const processStreams = (argv, streams = []) => {
  if (streams.length) {
    const task = streams.shift();
    task(argv).on('finish', () => {
      processStreams(argv, streams);
    });
  }
};

module.exports = (argv, streams = []) => {
  if (streams.length) {
    return processStreams(argv, streams);
  }
};
