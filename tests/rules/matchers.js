const requireCurrent = require('./requireCurrent');

const ramMatcher = ({ url }) => {
  if( url.startsWith('https://rickandmortyapi.com') ){
    if( url.includes('api/character/1') ){
      return 'Rick';
    }
    else if( url.includes('api/character/2') ){
      return 'Morty';
    }
    else {
      return false;
    }
  }
  else return false;
};

const exampleMatcher = ({ url }) => /example\.com\/$/.test(url);

module.exports = [
  ramMatcher,
  exampleMatcher,
];