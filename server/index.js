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
      var els = {};
      
      function writeResp(data) {
        els.resp.innerText = data;
      }
      
      function handleBtnClick(ev) {
        var btn = ev.target;
        var name = btn.name;
        var protocol = btn.dataset.protocol;
        
        switch(name){
          case 'cReq':
            writeResp('Loading');
            fetch('https://rickandmortyapi.com/api/character/1')
              .then((resp) => resp.json())
              .then((data) => writeResp(JSON.stringify(data, null, 2)))
              .catch((err) => writeResp(err));
            break;
          
          case 'sReq':
            writeResp('Loading');
            fetch(\`/api/data?protocol=\${protocol}\`)
              .then((resp) => resp.text())
              .then((data) => {
                if(data) writeResp(data);
                else writeResp('No data returned');
              })
              .catch((err) => writeResp(err));
            break;
        }
      }
      
      window.addEventListener('DOMContentLoaded', () => {
        document.body.addEventListener('click', handleBtnClick);
        els.resp = document.querySelector('#resp');
      });
    </script>
    <body>
      <button name="sReq" data-protocol="https">(Server) HTTPS Request</button>
      <button name="sReq" data-protocol="http">(Server) HTTP Request</button>
      <button name="cReq">Client Request</button>
      <pre
        id="resp"
        style="width:100%; height:600px; overflow:auto; background:#666; color:#eee; padding:1em;"
      ></pre>
    </body>
    </html>
  `);
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
          
          console.log(`Pinging ${ proxy }`);
          
          http.get(proxy, (res) => {
            console.log('success');
            clearInterval(ping);
          })
          .on('error', (err) => console.log('fail'));
        }
        else {
          clearInterval(ping);
        }
      }, 1000);
      
    }, 1000);
  });
