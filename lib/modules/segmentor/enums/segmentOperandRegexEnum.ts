export enum SegmentOperandRegexEnum {
  LOWER = '^lower',
  LOWER_MATCH = '^lower\\((.*)\\)',
  WILDCARD = '^wildcard',
  WILDCARD_MATCH = '^wildcard\\((.*)\\)',
  REGEX = '^regex',
  REGEX_MATCH = '^regex\\((.*)\\)',
  STARTING_STAR = '^\\*',
  ENDING_STAR = '\\*$'
}
