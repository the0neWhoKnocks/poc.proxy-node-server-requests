const color = require('cli-color');
const http = require('http');
const { networkInterfaces } = require('os');
const request = require('request');
const jsonResp = require('./jsonResp');
const requestHandler = require('./requestHandler');

const PORT = 3000;

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
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`
    <html>
    <head>
      <title></title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        *, *::before, *::after {
          box-sizing: border-box;
        }
        html, body {
          padding: 0;
          margin: 0;
        }
        body {
          font-family: Helvetica, Arial, sans-serif;
          background: #eee;
        }
      </style>
    </head>
    <script>
      function getServerData(){
        fetch('/api/data')
          .then((resp) => resp.json())
          .then((data) => console.log(data))
          .catch((err) => console.log(err));
      }
      
      function getClientData(){
        fetch('https://rickandmortyapi.com/api/character/1')
          .then((resp) => resp.json())
          .then((data) => console.log(data))
          .catch((err) => console.log(err));
      }
      
      window.addEventListener('DOMContentLoaded', () => {
        document.querySelector('[name="sReq"]').addEventListener('click', getServerData);
        document.querySelector('[name="cReq"]').addEventListener('click', getClientData);
      });
    </script>
    <body>
      <button name="sReq">Server Request</button>
      <button name="cReq">Client Request</button>
    </body>
    </html>
  `);
};

const errorHandler = ({ res }, code, msg) => {
  res.statusCode = code;
  res.end(msg);
};

const apiHandler = ({ res }) => {
  request({
    url: 'https://rickandmortyapi.com/api/character/2',
  }, (err, body, data) => {
    jsonResp(res, data);
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
    }, 1000);
  });
