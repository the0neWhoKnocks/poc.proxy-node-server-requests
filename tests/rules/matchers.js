const requireCurrent = require('./requireCurrent');

const ramMatcher = ({ url }) => {
  if( url.startsWith('https://rickandmortyapi.com') ){
    if( url.includes('api/character/1') ){
      return 'Rick Sanchez';
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

const typicodeMatcher = ({ requestOptions, url }) => {
  if( url.startsWith('https://jsonplaceholder.typicode.com') ){
    const data = requireCurrent('./testData.json');
    
    if(data.typicodeCallCount === 2) return '2nd call';
    if(data.typicodeCallCount === 3) return '3rd call';
    
    return true;
  }
  else return false;
};

module.exports = [
  ramMatcher,
  exampleMatcher,
  typicodeMatcher,
];