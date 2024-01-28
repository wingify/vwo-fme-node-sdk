const vwo = require('../dist');

async function start() {
  let context = {user: {id: "abhishek"}};
  const vwoClient = await vwo.init({ sdkKey: 'abc'});

  // settingsFIle -> rollout rule whitelisting pass, ab will fail with value abhishek, and will pass with value abhishek132
  const getFlag = await vwoClient.getFlag('feature-key', {user: {id: 'av1', customVariables: {name: 'abhishek123'}, variationTargetingVariables: {name: 'abhishek'}}});
  console.log('Flag: ', getFlag.getVariable('STRING_VARIABLE', 'abhishek'));
  vwoClient.track('addToCart', context, {revenueValue: 100, name: "abhishke"});

  // settingsFIle 1 -> no rollout rules enabled as status for all rules are off
  // console.log('Flag: ', await vwoClient.getFlag('feature-key-2', {user: {id: 'ab4', customVariables: {name: 'abhishek123'}, variationTargetingVariables: {name: 'abhishek'}}}));

  // settingsFIle 2 -> 
  //console.log('Flag: ', await vwoClient.getFlag('feature-key-2', {user: {id: 'ab4', customVariables: {name: 'abhishek'}, variationTargetingVariables: {name: 'marvel'}}}));
  //const result = await vwoClient.getFlag('feature-key-2', {user: {id: 'ab4', customVariables: {name: 'abhishek'}, variationTargetingVariables: {name: 'marvel'}}});
}

start();
