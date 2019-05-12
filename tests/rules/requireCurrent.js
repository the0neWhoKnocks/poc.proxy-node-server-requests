const requireCurrent = (module) => {
  delete require.cache[require.resolve(`${module}.js`)];
  return require(module);
};

module.exports = requireCurrent;