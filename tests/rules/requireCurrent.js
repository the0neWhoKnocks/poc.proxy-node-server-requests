const requireCurrent = (module) => {
  const ext = (/\.[a-z]{2,4}$/i.test(module)) ? '' : '.js';
  delete require.cache[require.resolve(`${module}${ext}`)];
  return require(module);
};

module.exports = requireCurrent;