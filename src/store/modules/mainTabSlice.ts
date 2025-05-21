import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type TabType =
  | 'dashboard'
  | 'patient'
  | 'reservation'
  | 'appointments'
  | 'messages'
  | 'documents'
  | 'data'
  | 'settings';

export type MainTabInitialState = {
  mainTab: TabType;
};

const initialState: MainTabInitialState = {
  mainTab: 'dashboard',
};

const mainTabSlice = createSlice({
  name: 'mainTab',
  initialState,
  reducers: {
    setTab: (state, action) => {
      state.mainTab = action.payload;
    },
  },
});

export default mainTabSlice;
export const userActions = { ...mainTabSlice.actions };
