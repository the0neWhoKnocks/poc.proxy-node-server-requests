const requireCurrent = require('./requireCurrent');

module.exports = {
  summary: 'Integration Request Rules',
  
  *beforeSendRequest(req) {
    return new Promise((resolve, reject) => {
      requireCurrent('./vcr').play({
        matchers: requireCurrent('./matchers'),
        req,
        resolve,
      });
    });
  },
  
  *beforeSendResponse(req, resp) {
    return new Promise((resolve, reject) => {
      const recordOpts = {
        matchers: requireCurrent('./matchers'),
        req, resp, resolve,
      };
      
      requireCurrent('./vcr').record(recordOpts);
    });
  },
};