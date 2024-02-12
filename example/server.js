const express = require('express');
const app = express();
const port = 4000;

const vwo = require('../dist');

async function start() {
  let context = {user: {id: "abhishek"}};
  const vwoClient = await vwo.init({ sdkKey: 'abc', storage: storageConnector});

  // settingsFIle -> rollout rule whitelisting pass, ab will fail with value abhishek, and will pass with value abhishek132
  const getFlag = await vwoClient.getFlag('feature-key', {user: {id: 'av1', customVariables: {name: 'abhishek123'}, variationTargetingVariables: {name: 'abhishek'}}});
  console.log(getFlag.isEnabled); // true/false
  console.log('Flag: ', getFlag.getVariable('STRING_VARIABLE', 'abhishek'));
  vwoClient.trackEvent('addToCart', context, {revenueValue: 100, name: "abhishke"});
  // vwoClient.setAttribute('abc', 'def', { user: {id: 'Varun'}})
  return {
    getFlag
  };
  // settingsFIle 1 -> no rollout rules enabled as status for all rules are off
  // console.log('Flag: ', await vwoClient.getFlag('feature-key-2', {user: {id: 'ab4', customVariables: {name: 'abhishek123'}, variationTargetingVariables: {name: 'abhishek'}}}));

  // settingsFIle 2 ->
  //console.log('Flag: ', await vwoClient.getFlag('feature-key-2', {user: {id: 'ab4', customVariables: {name: 'abhishek'}, variationTargetingVariables: {name: 'marvel'}}}));
  //const result = await vwoClient.getFlag('feature-key-2', {user: {id: 'ab4', customVariables: {name: 'abhishek'}, variationTargetingVariables: {name: 'marvel'}}});
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async (req, res) => {
  const result = await start();
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

class storageConnector {
  constructor() {
    this.map = {}
  }

  async get(featureKey, userId) {
    console.log('stored data: ', featureKey, userId);
    debugger
    return new Promise((resolve, reject) => {
      resolve(this.map[featureKey + '_' + userId]);
    });
  }

  async set(data) {
    console.log('data to store: ', data);
    debugger
    return new Promise((resolve, reject) => {
      const key = data.featureKey + '_' + data.user;
      
      // Check if the key already exists in the map
      if (this.map.hasOwnProperty(key)) {
        // If the key already exists, update its value
        this.map[key] = {
          rolloutKey: data.rolloutKey,
          rolloutVariationId: data.rolloutVariationId,
          experimentKey: data.experimentKey,
          experimentVariationId: data.experimentVariationId
        };
      } else {
        // If the key does not exist, add a new key-value pair
        this.map[key] = {
          rolloutKey: data.rolloutKey,
          rolloutVariationId: data.rolloutVariationId,
          experimentKey: data.experimentKey,
          experimentVariationId: data.experimentVariationId
        };
      }
  
      resolve(true);
    });
  }
}
