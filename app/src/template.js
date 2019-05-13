const { readFileSync } = require('fs');
const { resolve } = require('path');

module.exports = ({ data }) => `
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
    window.appData = ${ data };
  </script>
  <script>${ readFileSync(resolve(__dirname, './client.js')) }</script>
  <body>
    <button name="sReq" data-protocol="https">(Server) HTTPS Request</button>
    <button name="sReq" data-protocol="http">(Server) HTTP Request</button>
    <button name="cReq" data-method="get">Client (GET) Request</button>
    <button name="cReq" data-method="post">Client (POST) Request</button>
    <pre
      id="resp"
      style="width:100%; height:600px; overflow:auto; background:#666; color:#eee; padding:1em;"
    ></pre>
  </body>
  </html>
`;