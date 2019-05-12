const requireCurrent = require('./requireCurrent');

const ramHandler = (resp) => {
  const response = resp.response;
  
  if(response.header['Content-Type'].includes('application/json')){
    response.body = JSON.parse(response.body.toString('utf8'));
  }
  
  return response;
};

const ramMatcher = ({ url }) => {
  return ( url.startsWith('https://rickandmortyapi.com') )
    ? ramHandler
    : false;
};

module.exports = [
  ramMatcher,
];