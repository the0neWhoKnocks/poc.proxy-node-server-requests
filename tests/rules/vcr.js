const { readFileSync, writeFileSync } = require('fs');
const requireCurrent = require('./requireCurrent');

const play = ({ matchers, req, resolve }) => {
  const url = req.url;
  const { fileName, filePath } = requireCurrent('./getFileName')({ url });
  
  try {
    const file = readFileSync(filePath);
    const { response } = JSON.parse(file);
  
    if(response.header['Content-Type'].includes('application/json')){
      response.body = Buffer.from( JSON.stringify(response.body) );
    }
  
    console.log(`[PROXY] Play back '${ fileName }' for '${ url }'`);
    resolve({ response });
  }
  catch(err) {
    if(err.code !== 'ENOENT') console.log(err);
  
    // only log if a user has specified a matcher rule
    for(let i=0; i<matchers.length; i++){
      if( matchers[i](req) ) {
        console.log(`[PROXY] No Recording found for '${ url }'`);
        break;
      }
    }
  
    resolve(null);
  }
};

const record = ({ matchers, req, resp, resolve }) => {
  const url = req.url;
  let match;
  
  for(let i=0; i<matchers.length; i++){
    match = matchers[i](req);
    if( match ) break;
  }
  
  if(match) {
    const { fileName, filePath } = requireCurrent('./getFileName')({ url });
    const response = resp.response;
    let body = response.body.toString('utf8');
    
    if(response.header['Content-Type'].includes('application/json')){
      body = JSON.parse(body);
    }
    
    const fileData = {
      // request: {
      //   protocol: req.protocol,
      //   // requestData: req.requestData, // POST data
      //   requestOptions: req.requestOptions,
      //   url,
      // },
      response: {
        body,
        header: response.header,
        statusCode: response.statusCode,
      },
    };
    
    try{
      // Record request/response
      writeFileSync(filePath, JSON.stringify(fileData, null, 2));
      console.log(`[PROXY] Recorded '${ fileName }' for '${ url }'`);
    }
    catch(err){
      response.statusCode = 500;
      response.body = `${err.code} | ${err.stack}`;
    }
    
    resolve({ response });
  }
  else {
    console.log(`[PROXY] Pass through response for '${ url }'`);
    resolve();
  }
};

module.exports = {
  play,
  record,
};