enum DecisionTypes {
    CAMPAIGN_DECISION = 'CAMPAIGN_DECISION'
  }
  
  interface HooksEnum {
    DECISION_TYPES: typeof DecisionTypes;
  }
  
  const HooksEnum: HooksEnum = {
    DECISION_TYPES: DecisionTypes
  };