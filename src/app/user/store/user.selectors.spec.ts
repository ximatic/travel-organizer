import { MOCK_INITIAL_USER_STATE, MOCK_INITIAL_USER_STATE_1 } from '../../../../__mocks__/constants/user.constants';

import { selectUserData } from './user.selectors';
import { UserState } from './user.state';

describe('User Selectors', () => {
  describe('with null initial state', () => {
    const initialState: UserState = MOCK_INITIAL_USER_STATE;

    it('should return null for User Data', () => {
      const result = selectUserData.projector(initialState);
      expect(result).toBeNull();
    });
  });

  describe('with not null initial state', () => {
    const initialState: UserState = MOCK_INITIAL_USER_STATE_1;

    it('should return data for User Data', () => {
      const result = selectUserData.projector(initialState);
      expect(result?.email).toEqual(MOCK_INITIAL_USER_STATE_1.email);
      expect(result?.profile).toEqual(MOCK_INITIAL_USER_STATE_1.profile);
    });
  });
});
