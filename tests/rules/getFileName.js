const getFileName = ({ name, url }) => {
  const hash = require('crypto').createHash('md5').update(url).digest('hex');
  
  // return `${ process.env.RECORDINGS_DIR }/${ name }-${hash}.json`;
  return {
    fileName: hash,
    filePath: `${ process.env.RECORDINGS_DIR }/${hash}.json`,
  };
};

module.exports = getFileName;