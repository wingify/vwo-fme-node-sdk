const vwo = require('../dist');

async function start() {
  let context = {user: {id: "abhishek"}};
  const vwoClient = await vwo.init({ sdkKey: 'eb6b4136609979ccfc6254cd5cb3fa2e', accountId: '14000280',
    // webService : {
    //   url: 'localhost:8000'
    // }
  });
  console.log('VWO Client: ', vwoClient.settings);
  const getFlag = await vwoClient.getFlag('newAbhishekFlag', {user: {id: 'ab3', customVariables: {name: 'saksham'}, variationTargetingVariables: {name: '321'}}});
  console.log('Flag: ', getFlag.isEnabled);
  vwoClient.trackEvent('movieOrEvent', {}, {user: {id: 'ab3'}});
  // settingsFIle -> rollout rule whitelisting pass, ab will fail with value abhishek, and will pass with value abhishek132
  // const getFlag = await vwoClient.getFlag('feature-key', {user: {id: 'av1', customVariables: {name: 'abhishek123'}, variationTargetingVariables: {name: 'abhishek'}}});
  // console.log('Flag: ', getFlag.getVariable('STRING_VARIABLE', 'abhishek'));
  // vwoClient.track('addToCart', context, {revenueValue: 100, name: "abhishke"});

  // settingsFIle 1 -> no rollout rules enabled as status for all rules are off
  // console.log('Flag: ', await vwoClient.getFlag('feature-key-2', {user: {id: 'ab4', customVariables: {name: 'abhishek123'}, variationTargetingVariables: {name: 'abhishek'}}}));

  // settingsFIle 2 ->
  //console.log('Flag: ', await vwoClient.getFlag('feature-key-2', {user: {id: 'ab4', customVariables: {name: 'abhishek'}, variationTargetingVariables: {name: 'marvel'}}}));
  //const result = await vwoClient.getFlag('feature-key-2', {user: {id: 'ab4', customVariables: {name: 'abhishek'}, variationTargetingVariables: {name: 'marvel'}}});
}

start();
