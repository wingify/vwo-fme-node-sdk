export const BASIC_ROLLOUT_TESTING_RULE_SETTINGS = {
    "features": [{
      "key": "feature1",
      "name": "Feature1",
      "metrics": [{
        "id": 1,
        "type": "REVENUE_TRACKING",
        "identifier": "custom1",
        "mca": -1
      }],
      "rules": [{
        "variationId": 1,
        "type": "FLAG_ROLLOUT",
        "campaignId": 1,
        "ruleKey": "rolloutRule1"
      },{
        "variationId": 2,
        "type": "FLAG_ROLLOUT",
        "campaignId": 1,
        "ruleKey": "rolloutRule2"
      }, 
      {
        "campaignId": 2,
        "type": "FLAG_TESTING",
        "ruleKey": "testingRule1"
      },
      {
        "campaignId": 3,
        "type": "FLAG_TESTING",
        "ruleKey": "testingRule2"
      }],
      "type": "FEATURE_FLAG",
      "impactCampaign": {},
      "id": 1,
      "status": "ON"
    }],
    "version": 1,
    "accountId": 12345,
    "sdkKey": "000000000000_MASKED_000000000000",
    "campaigns": [{
      "key": "feature1_rolloutRule1",
      "id": 1,
      "segments": {},
      "isForcedVariationEnabled": false,
      "variations": [{
        "variables": [{
          "key": "int",
          "id": 1,
          "value": 10,
          "type": "integer"
        }, {
          "key": "float",
          "id": 2,
          "value": 20.01,
          "type": "double"
        }, {
          "key": "string",
          "id": 3,
          "value": "test",
          "type": "string"
        }, {
          "key": "boolean",
          "id": 4,
          "value": false,
          "type": "boolean"
        }, {
          "key": "json",
          "id": 5,
          "value": "{\"name\": \"varun\"}",
          "type": "json"
        }],
        "id": 1,
        "segments": {
          "or": [{
            "custom_variable": {
              "price": "100"
            }
          }]
        },
        "weight": 100,
        "name": "Rollout-rule-1"
      },{
        "variables": [{
            "key": "int",
            "id": 1,
            "value": 11,
            "type": "integer"
          }, {
            "key": "float",
            "id": 2,
            "value": 20.02,
            "type": "double"
          }, {
            "key": "string",
            "id": 3,
            "value": "test_variation",
            "type": "string"
          }, {
            "key": "boolean",
            "id": 4,
            "value": true,
            "type": "boolean"
          }, {
            "key": "json",
            "id": 5,
            "value": {
              "variation": 1,
              "name": "VWO"
            },
            "type": "json"
          }],
        "id": 2,
        "segments": {
          "or": [{
            "custom_variable": {
              "price": "200"
            }
          }]
        },
        "weight": 100,
        "name": "Rollout-rule-2"
      }],
      "type": "FLAG_ROLLOUT",
      "status": "RUNNING"
    }, {
      "key": "feature1_testingRule1",
      "id": 2,
      "segments": {
        "or": [{
          "custom_variable": {
            "price": "100"
          }
        }]
      },
      "isForcedVariationEnabled": false,
      "variations": [{
        "weight": 50,
        "id": 1,
        "variables": [{
          "key": "int",
          "id": 1,
          "value": 10,
          "type": "integer"
        }, {
          "key": "float",
          "id": 2,
          "value": 20.01,
          "type": "double"
        }, {
          "key": "string",
          "id": 3,
          "value": "test",
          "type": "string"
        }, {
          "key": "boolean",
          "id": 4,
          "value": false,
          "type": "boolean"
        }, {
          "key": "json",
          "id": 5,
          "value": "{\"name\": \"varun\"}",
          "type": "json"
        }],
        "name": "Default"
      }, {
        "weight": 50,
        "id": 2,
        "variables": [{
          "key": "int",
          "id": 1,
          "value": 11,
          "type": "integer"
        }, {
          "key": "float",
          "id": 2,
          "value": 20.02,
          "type": "double"
        }, {
          "key": "string",
          "id": 3,
          "value": "test_variation",
          "type": "string"
        }, {
          "key": "boolean",
          "id": 4,
          "value": true,
          "type": "boolean"
        }, {
          "key": "json",
          "id": 5,
          "value": {
            "variation": 1,
            "name": "VWO"
          },
          "type": "json"
        }],
        "name": "Variation-1"
      }],
      "percentTraffic": 100,
      "type": "FLAG_TESTING",
      "status": "RUNNING"
    },{
        "key": "feature1_testingRule2",
        "id": 3,
        "segments": {
          "or": [{
            "custom_variable": {
              "price": "200"
            }
          }]
        },
        "isForcedVariationEnabled": false,
        "variations": [{
          "weight": 50,
          "id": 1,
          "variables": [{
            "key": "int",
            "id": 1,
            "value": 10,
            "type": "integer"
          }, {
            "key": "float",
            "id": 2,
            "value": 20.01,
            "type": "double"
          }, {
            "key": "string",
            "id": 3,
            "value": "test",
            "type": "string"
          }, {
            "key": "boolean",
            "id": 4,
            "value": false,
            "type": "boolean"
          }, {
            "key": "json",
            "id": 5,
            "value": "{\"name\": \"varun\"}",
            "type": "json"
          }],
          "name": "Default"
        }, {
          "weight": 50,
          "id": 2,
          "variables": [{
            "key": "int",
            "id": 1,
            "value": 11,
            "type": "integer"
          }, {
            "key": "float",
            "id": 2,
            "value": 20.02,
            "type": "double"
          }, {
            "key": "string",
            "id": 3,
            "value": "test_variation",
            "type": "string"
          }, {
            "key": "boolean",
            "id": 4,
            "value": true,
            "type": "boolean"
          }, {
            "key": "json",
            "id": 5,
            "value": {
              "variation": 1,
              "name": "VWO"
            },
            "type": "json"
          }],
          "name": "Variation-1"
        }],
        "percentTraffic": 100,
        "type": "FLAG_TESTING",
        "status": "RUNNING"
      }]
  }
  