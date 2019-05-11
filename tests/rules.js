const { readFileSync, writeFileSync } = require('fs');

// TODO - should create a `rules` folder so that files can be required relative
// to the directory so as not to have issues when mapped to the proxy Container.

const getFileName = ({ name, url }) => {
  const hash = require('crypto').createHash('md5').update(url).digest('hex');
  
  // TODO - allow for `name` prefix
  // return `${ process.env.RECORDINGS_DIR }/${ name }-${hash}.json`;
  return `${ process.env.RECORDINGS_DIR }/${hash}.json`;
};

const handleRickAndMorty = ({ req, resp, resolve }) => {
  const response = resp.response;
  let body = response.body;
  
  if(response.header['Content-Type'].includes('application/json')){
    body = JSON.parse(response.body.toString('utf8'));
  }
  
  // TODO - create hash based on url and reqData (for posts)
  
  const filename = getFileName({ name: 'rickAndMorty', url: req.url });
  
  try{
    // Record request/response
    writeFileSync(filename, JSON.stringify({
      request: {
        protocol: req.protocol,
        // requestData: req.requestData, // POST data
        requestOptions: req.requestOptions,
        url: req.url,
      },
      response: {
        body,
        header: response.header,
        statusCode: response.statusCode,
      },
    }, null, 2));
    console.log(`[PROXY] Recorded '${ filename }'`);
  }
  catch(err){
    response.statusCode = 500;
    response.body = `${err.code} | ${err.stack}`;
  }

  resolve({ response });
};

const playRecording = ({ resolve, url }) => {
  const filename = getFileName({ url });
  
  try {
    const file = readFileSync(filename);
    const response = JSON.parse(file).response;
    
    if(response.header['Content-Type'].includes('application/json')){
      response.body = Buffer.from( JSON.stringify(response.body) );
    }
    
    console.log(`[PROXY] Play back '${ filename }'`);
    resolve({ response });
  }
  catch(err) {
    if(err.code !== 'ENOENT') console.log(err);
    console.log(`[PROXY] No Recording found for '${ filename }'`);
    resolve(null);
  }
};

module.exports = {
  summary: 'Integration Request Rules',
  
  *beforeSendRequest(req) {
    return new Promise((resolve, reject) => {
      playRecording({ resolve, url: req.url });
    });
  },
  
  *beforeSendResponse(req, resp) {
    return new Promise((resolve, reject) => {
      // TODO - Make this more generic so that it just loops over an Array
      // of Strings or RegEx's to determine whether or not it needs to record.
      if(req.url.startsWith('https://rickandmortyapi.com')){
        handleRickAndMorty({ req, resp, resolve });
      }
      else {
        console.log('[PROXY] Serving non-recorded response');
        resolve();
      }
    });
  },
};