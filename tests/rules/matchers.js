const requireCurrent = require('./requireCurrent');

const ramMatcher = ({ url }) => url.startsWith('https://rickandmortyapi.com');
const exampleMatcher = ({ url }) => /example\.com\/$/.test(url);

module.exports = [
  ramMatcher,
  exampleMatcher,
];