const { 
  existsSync, 
  mkdirSync, 
  readFileSync, 
  writeFileSync,
} = require('fs');
const color = require('cli-color');
const requireCurrent = require('./requireCurrent');

const logPrefix = color.green.inverse(' PROXY ');

const getReqData = ({ matchers, req }) => {
  const method = req.requestOptions.method;
  let match, postData;
  
  for(let i=0; i<matchers.length; i++){
    match = matchers[i](req);
    
    if( match ) {
      if(method === 'POST'){
        postData = req.requestData.toString('utf8');
      }
      break;
    }
  }
  
  return { match, method, postData };
};

const play = ({ matchers, req, resolve }) => {
  const url = req.url;
  const { match, method, postData } = getReqData({ matchers, req });
  
  // Only try to look up the cache if something has matched
  if(match){
    const { fileName, filePath } = requireCurrent('./getFileName')({
      id: match,
      method,
      postData,
      url,
    });
    
    try {
      const file = readFileSync(filePath);
      const { response } = JSON.parse(file);
    
      if(
        response.header['Content-Type'] // OPTIONS calls won't have this
        && response.header['Content-Type'].includes('application/json')
      ){
        response.body = Buffer.from( JSON.stringify(response.body) );
      }
    
      console.log(`${logPrefix} Play back ${ color.magenta(fileName) } for (${method}) ${ color.cyan(url) }`);
      resolve({ response });
    }
    catch(err) {
      if(err.code !== 'ENOENT') console.log(err);
    
      // only log if a user has specified a matcher rule
      if( !!match ) {
        console.log(`${logPrefix} No Recording found for (${method}) ${ color.cyan(url) }`);
      }
    
      resolve(null);
    }
  }
  else {
    resolve(null);
  }
};

const record = ({ matchers, req, resp, resolve }) => {
  const url = req.url;
  const { match, method, postData } = getReqData({ matchers, req });
  
  if(match) {
    const { fileName, filePath } = requireCurrent('./getFileName')({
      id: match,
      method,
      postData,
      url,
    });
    const response = resp.response;
    let body = response.body.toString('utf8');
    
    if(
      response.header['Content-Type'] // OPTIONS calls won't have this
      && response.header['Content-Type'].includes('application/json')
    ){
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
      const dir = `${process.env.RECORDINGS_DIR}/${method}`;
      if(!existsSync(dir)) mkdirSync(dir);
      writeFileSync(filePath, JSON.stringify(fileData, null, 2));
      console.log(`${logPrefix} Recorded ${ color.magenta(fileName) } for ${ color.cyan(url) }`);
    }
    catch(err){
      response.statusCode = 500;
      response.body = `${err.code} | ${err.stack}`;
    }
    
    resolve({ response });
  }
  else {
    console.log(`${logPrefix} Pass through response for ${ color.cyan(url) }`);
    resolve();
  }
};

module.exports = {
  play,
  record,
};