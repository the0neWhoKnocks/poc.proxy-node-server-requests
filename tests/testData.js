const { writeFile } = require('fs');
const { join } = require('path');
const defaultData = require('./testData.json');

const write = (data = defaultData) => new Promise((resolve, reject) => {
  writeFile(join(__dirname, './rules/testData.json'), JSON.stringify(data, null, 2), (err) => {
    if(err) reject(err);
    else resolve();
  });
});

const reset = () => write();
const use = () => write();

const update = (props) => {
  const data = { ...defaultData };
  
  Object.keys(props).forEach((prop) => {
    data[prop] = props[prop];
  });
  
  return write(data);
};

module.exports = {
  reset,
  update,
  use,
};