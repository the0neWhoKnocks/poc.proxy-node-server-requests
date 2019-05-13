const getFileName = ({ id, method, postData, url }) => {
  const hashData = (postData) ? `${url}${JSON.stringify(postData)}` : url;
  const hash = require('crypto')
    .createHash('md5')
    .update(hashData)
    .digest('hex');
  const domain = url.replace(/https?:\/\//, '').split('/')[0];
  const name = (id && typeof id === 'string')
    ? `${domain}__${id.replace(/\s/g, '-')}`
    : `${domain}__${hash}`;
  
  return {
    fileName: name,
    filePath: `${ process.env.RECORDINGS_DIR }/${method}/${name}.json`,
  };
};

module.exports = getFileName;