import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TeleconsultingModalSliceState = {
  isOpened: boolean;
  chartId: string | null;
};

const initialState: TeleconsultingModalSliceState = {
  isOpened: false,
  chartId: null,
};

const teleconsultingModalSlice = createSlice({
  name: 'teleconsulgingModal',
  initialState,
  reducers: {
    setChartId: (state, action: PayloadAction<string | null>) => {
      state.chartId = action.payload;
    },
    openModal: (state) => {
      state.isOpened = true;
    },
    closeModal: (state) => {
      state.isOpened = true;
    },
  },
});

export default teleconsultingModalSlice;
export const teleconsultingwModalActions = {
  ...teleconsultingModalSlice.actions,
};
