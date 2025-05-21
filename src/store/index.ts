import { configureStore } from '@reduxjs/toolkit';
import userSlice from './modules/userSlice';
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux';
import mainTabSlice from './modules/mainTabSlice';
import workflowModalSlice from './modules/workflowModalSlice';
import teleconsultingModalSlice from './modules/teleconsultingModalSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice.reducer,
      mainTab: mainTabSlice.reducer,
      workflowModal: workflowModalSlice.reducer,
      teleconsultingModal: teleconsultingModalSlice.reducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
