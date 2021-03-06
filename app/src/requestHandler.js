const { normalize } = require('path');
const url = require('url');

module.exports = (routes) => async (req, res) => {
  // extract URL path
  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
  // by limiting the path to current directory only
  const parsedReq = url.parse(req.url, true);
  const cleanPath = normalize( parsedReq.pathname ).replace(/^(\.\.[/\\])+/, '');
  let path, handler, args, reqData, dataPromise;
  
  dataPromise = new Promise((resolve, reject) => {
    switch(req.method) {
      case 'GET':
        reqData = parsedReq.query || {};
        resolve();
        break;
        
      case 'POST':
      case 'PUT': {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          reqData = (body) ? JSON.parse(body) : {};
          resolve();
        });
        break;
      }
    }
  });
  
  dataPromise.then(() => {
    let emitLog;
    
    for(let i=0; i<routes.length; i++){
      const route = routes[i];
      path = route[0];
      handler = route[1];
      const routeArgs = route[2];
      emitLog = route[3] === undefined || route[3];
      
      // every handler needs the response
      args = [{
        res,
        req,
        reqData,
      }];
      // some handlers pass custom args
      if(routeArgs) args = [...args, ...routeArgs];
      // tack on any useful data to the end of all calls
      args.push(cleanPath);
      
      if( path instanceof RegExp && path.test(cleanPath) ) {
        args[0].matches = cleanPath.match(path);
        break;
      }
      else if( cleanPath === path ) break;
    }
    
    if(emitLog) console.log(`Route matched (${ req.method }) "${ path }" for ${ cleanPath }`);
    handler(...args);
  });
};