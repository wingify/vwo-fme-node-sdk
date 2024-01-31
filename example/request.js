const https = require('https');

const options = {
  "hostname": "dev.visualwebsiteoptimizer.com",
  // "port": 80,
  "method": "POST",
  "path": "/events/t",
  // "query": {
  //     "en": "vwo_variationShown",
  //     "a": 879454,
  //     "env": "b2b4d6b7bf2f3fa6f2aac4cd5525d015",
  //     "eTime": 1713725363924,
  //     "random": 0.4278361673280351,
  //     "p": "FS",
  //     "visitor_ua": "",
  //     "visitor_ip": "",
  //     "url": "https://dev.visualwebsiteoptimizer.com/events/t"
  // }
};

const body = {
  "d": {
      "msgId": "C0AED66BDE4B567AB2574C091FFF0D06-1713725363924",
      "visId": "C0AED66BDE4B567AB2574C091FFF0D06",
      "sessionId": 1713725364,
      "event": {
          "props": {
              "vwo_sdkName": "@wingify/vwo-sdk",
              "vwo_sdkVersion": "1.0.0",
              "vwo_envKey": "b2b4d6b7bf2f3fa6f2aac4cd5525d015",
              "id": 14,
              "variation": 1,
              "isFirst": 1

          },
          "name": "vwo_variationShown",
          "time": 1713725363924
      },
      "visitor": {
          "props": {
              "vwo_fs_environment": "b2b4d6b7bf2f3fa6f2aac4cd5525d015"
          }
      }
  }
};

options.headers = {
  'Content-Type': 'application/json',
  'Content-Length': Buffer.byteLength(JSON.stringify(body))
};

console.log(options);
const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(JSON.stringify(body));
req.end();
