const vwo = require('../dist');

async function start() {
  const vwoClient = await vwo.init({ sdkKey: 'abc'});

  console.log('client: ', vwoClient.settings);
  console.log('Flag: ', await vwoClient.getFlag('feature-key'));
}

start();
