const { readFileSync } = require('fs');
const { resolve } = require('path');
const color = require('cli-color');
const http = require('http');
const { networkInterfaces } = require('os');
const request = require('request');
const jsonResp = require('./jsonResp');
const requestHandler = require('./requestHandler');

const PORT = process.env.SERVER_PORT || 3000;

process.on('unhandledRejection', (reason , p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const getExternalIP = () => {
  const ifaces = networkInterfaces();
  let ip;
  
  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (
        iface.family === 'IPv4'
        && iface.internal === false
        // Use the first `en` (ethernet) interface. Sometimes wireless which
        // should be `wl` shows up under `en`, so just roll with it :\
        && /(en|eth)\d+/i.test(ifname)
      ) {
        ip = iface.address;
      }
    });
  });
  
  return ip;
};

const rootHandler = ({ res }) => {
  // ensure code is current on load (used to prevent spinning up a watcher or rebuild Docker container)
  delete require.cache[require.resolve('./template.js')];
  const template = require('./template');
  
  request({
    url: 'https://rickandmortyapi.com/api/character/2',
  }, (err, body, data) => {
    if(err) {
      res.statusCode = 500;
      res.end(`${err.code} | ${err.stack}`);
    }
    else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(template({ data }));
    }
  });
};

const errorHandler = ({ res }, code, msg) => {
  res.statusCode = code;
  res.end(msg);
};

const apiHandler = ({ reqData, res }) => {
  const url = `${ reqData.protocol }://example.com`;
  
  request({
    // url: 'https://rickandmortyapi.com/api/character/2',
    url,
  }, (err, body, data) => {
    if(err) {
      res.statusCode = 500;
      res.end(`${err.code} | ${err.stack}`);
    }
    else {
      // jsonResp(res, data);
      res.end(data);
    }
  });
};

http
  .createServer(requestHandler([
    ['/', rootHandler],
    [/\/api\/.*/, apiHandler],
    ['*', errorHandler, [404, 'Page Not Found']],
  ]))
  .listen(PORT, (err) => {
    if(err) throw err;
    setTimeout(() => {
      let msg =
        'Server running at:'
        + `\n  Internal: ${ color.cyan(`http://localhost:${ PORT }/`) }`
        + `\n  External: ${ color.cyan(`http://${ getExternalIP() }:${ PORT }/`) }`;
      
      console.log(msg);
      
      const proxy = process.env.HTTP_PROXY;
      const maxPing = 5;
      let pingCount = 0;
      const ping = setInterval(() => {
        if(pingCount < maxPing){
          pingCount += 1;
          
          http.get(proxy, (res) => {
            console.log( color.green('Ping for Proxy successful') );
            clearInterval(ping);
          })
          .on('error', (err) => 
            console.warn( color.yellow(`Ping for ${ color.cyan(proxy) } failed`) )
          );
        }
        else {
          clearInterval(ping);
          console.error( color.red('Ping limit reached, Proxy unreachable') );
          process.exit(0);
        }
      }, 1000);
      
    }, 1000);
  });
