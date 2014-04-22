/**
 * Sample automated test scenario for Nightwatch.js
 *
 * > it navigates to google.com and searches for nightwatch,
 *   verifying if the term 'The Night Watch' exists in the search results
 */
var https = require('https');
module.exports = {
  'demo test google' : function (client) {
    client
      .url('http://google.com')
      .waitForElementPresent('body', 1000)
      .setValue('input[type=text]', ['nightwatch', client.Keys.ENTER])
      .waitForElementVisible('#main', 1000, false)
      .end();
  },

  tearDown : function(callback) {
    var data = JSON.stringify({
      "passed" : true,
      "tags" : ["test","example"]
    });

    var requestPath = '/rest/v1/'+ this.client.options.username +'/jobs/' + this.client.sessionId;
    try {
      console.log('Updaing saucelabs', requestPath)
      var req = https.request({
        hostname: 'saucelabs.com',
        path: requestPath,
        method: 'PUT',
        auth : this.client.options.username + ':' + this.client.options.access_key,
        headers : {
          'Content-Type': 'application/json',
          'Content-Length' : data.length
        }
      }, function(res) {
        res.setEncoding('utf8');
        console.log('Response: ', res.statusCode, JSON.stringify(res.headers));
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
        res.on('end', function () {
          console.info('Finished updating saucelabs.');
          callback();
        });
      });

      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      req.write(data);
      req.end();
    } catch (err) {
      console.log('Error', err);
      callback();
    }

  }
};
