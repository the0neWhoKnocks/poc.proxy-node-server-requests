const launchOpts = {
  args: [
    '--incognito',
    `--proxy-server=127.0.0.1:${ process.env.HOST_PROXY_PORT }`,
  ],
  headless: false,
};

if(process.env.WSL_ENV){
  launchOpts.args.push(
    '--disable-setuid-sandbox',
    '--no-sandbox'
  );
  launchOpts.executablePath = process.env.CHROME_BINARY;
  // NOTE - this has to be in a Windows format to resolve correctly
  launchOpts.userDataDir = process.env.CHROME_DATA_DIR
    // swap out seperators with Windows ones
    .replace(/\//g, '\\')
    // swap out /mnt/<drive> or /<drive> with <drive>:\
    .replace(/^\\(?:mnt\\)?([a-z])\\/i, '$1:\\');
}

module.exports = launchOpts;