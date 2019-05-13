const getFileName = ({ id, method, url }) => {
  const hash = require('crypto').createHash('md5').update(url).digest('hex');
  const domain = url.replace(/https?:\/\//, '').split('/')[0];
  const name = (id && typeof id === 'string')
    ? `${domain}_${id}`
    : `${domain}_${hash}`;
  
  return {
    fileName: name,
    filePath: `${ process.env.RECORDINGS_DIR }/${method}/${name}.json`,
  };
};

module.exports = getFileName;