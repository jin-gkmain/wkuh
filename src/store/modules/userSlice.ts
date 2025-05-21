import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type UserInitialState = {
  userInfo: StoredUser | null;
};

const initialState: UserInitialState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 로그인시 id, token.... 저장
    setUser: (state, action: PayloadAction<StoredUser>) => {
      console.log('set User dispatch: ', action.payload);
      return {
        ...state,
        userInfo: { ...action.payload },
      };
    },
    // 로그아웃시
    removeUser: (state) => {
      console.log('remove user');
      return {
        ...state,
        userInfo: null,
      };
    },
  },
});

export default userSlice;
export const userActions = { ...userSlice.actions };
