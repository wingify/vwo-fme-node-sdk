/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  dslContainsPulseSurveyKey,
  doesConvertedUuidMatchPulseVisitor,
  getVwoUuidFromCookie,
  isPulseVisitorVerified,
  resolvePulsePreSegmentationIdentity,
} from '../../../lib/utils/PulsePreSegmentationUtil';

describe('PulsePreSegmentationUtil', () => {
  test('dslContainsPulseSurveyKey finds nested survey leaves', () => {
    expect(
      dslContainsPulseSurveyKey({
        and: [{ or: [{ '392797_vwo_surveyQuestionSubmitted_1891366': '1' }] }],
      }),
    ).toBe(true);
    expect(dslContainsPulseSurveyKey({ or: [{ custom_variable: { plan: 'pro' } }] })).toBe(false);
  });

  test('getVwoUuidFromCookie reads _vwo_uuid', () => {
    expect(getVwoUuidFromCookie('foo=bar; _vwo_uuid=Dabc123; other=1')).toBe('Dabc123');
    expect(getVwoUuidFromCookie('foo=bar')).toBeNull();
    expect(getVwoUuidFromCookie('')).toBeNull();
  });

  test('doesConvertedUuidMatchPulseVisitor is case-insensitive', () => {
    expect(doesConvertedUuidMatchPulseVisitor('DABC', 'dabc')).toBe(true);
    expect(doesConvertedUuidMatchPulseVisitor('AAAA', 'BBBB')).toBe(false);
  });

  test('isPulseVisitorVerified requires the cookie to match the evaluated uuid', () => {
    expect(isPulseVisitorVerified('DABC', 'foo=1; _vwo_uuid=dabc')).toBe(true);
    expect(isPulseVisitorVerified('OTHER', '_vwo_uuid=DABC')).toBe(false);
    expect(isPulseVisitorVerified('DABC', 'foo=1')).toBe(false);
    expect(isPulseVisitorVerified(undefined, '_vwo_uuid=DABC')).toBe(false);
  });

  test('resolvePulsePreSegmentationIdentity covers cookie missing, cookie as id, mismatch, and match', () => {
    const logs: string[] = [];
    const logError = (message: string) => logs.push(message);

    const missingCookie = resolvePulsePreSegmentationIdentity({ id: 'user_1' }, null, 'UUID1', logError);
    expect(missingCookie.id).toBe('user_1');
    expect(logs[0]).toContain('_vwo_uuid cookie is not present');

    const cookieAsId = resolvePulsePreSegmentationIdentity({}, 'Dvisitor', null, logError);
    expect(cookieAsId.id).toBe('Dvisitor');
    expect(logs).toHaveLength(1);

    const mismatch = resolvePulsePreSegmentationIdentity({ id: 'user_1' }, 'Dvisitor', 'OTHERUUID', logError);
    expect(mismatch.id).toBe('user_1');
    expect(logs[1]).toContain('FE user does not match Pulse user');

    const match = resolvePulsePreSegmentationIdentity({ id: 'Dvisitor' }, 'Dvisitor', 'Dvisitor', logError);
    expect(match.id).toBe('Dvisitor');
    expect(logs).toHaveLength(2);
  });
});
