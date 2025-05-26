import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type WorkflowTabType =
  | "patient"
  | "opinion"
  | "preliminary"
  | "teleconsulting"
  | "carePlans"
  | "visitForm"
  | "visitInfo"
  | "visitResult"
  | "postConsulting"
  | "postPrescript";

type WorkflowModalStateType = "new" | "manage" | "view";

export type Gubun =
  | "pa" // 환자정보
  | "op" // 소견서 정보
  | "pr" // 사전문진
  | "te" // 원격협진
  | "ca" // 치료계획서
  | "vif" // 내원준비
  | "vii" // 내원상담
  | "vir" // 내원결과
  | "poc" // 사후상담
  | "pp" // 사후처방
  | "chat" // 채팅
  | "update"; // update ( 진료목록 최근 업데이트일 용도 )
// | 'pp-completed' // 사후처방 완료
// | 'te-completed'; // 원격협진 완료

export type WorkflowModalSliceState = {
  chartId: null | number;
  tabType: WorkflowTabType;
  modalStateType: WorkflowModalStateType;
  patientId: number | null;
  edit: [number];
};

const initialState: WorkflowModalSliceState = {
  chartId: null,
  tabType: "patient",
  modalStateType: "new",
  patientId: null,
  edit: [0],
};

const workflowModalSlice = createSlice({
  name: "workflowModal",
  initialState,
  reducers: {
    setChartId: (state, action: PayloadAction<number | null>) => {
      state.chartId = action.payload;
    },
    setTabType: (state, action: PayloadAction<WorkflowTabType>) => {
      state.tabType = action.payload;
    },
    setType: (state, action: PayloadAction<WorkflowModalStateType>) => {
      state.modalStateType = action.payload;
    },
    setPatientId: (state, action: PayloadAction<number | null>) => {
      state.patientId = action.payload;
    },
    addChart: (
      state,
      action: PayloadAction<{ w_idx: number; p_idx: number }>
    ) => {
      state.patientId = action.payload.p_idx;
      state.chartId = action.payload.w_idx;
      state.modalStateType = "new";
      state.tabType = "patient";
    },
    manageChart: (
      state,
      action: PayloadAction<{ w_idx: number; p_idx: number }>
    ) => {
      state.patientId = action.payload.p_idx;
      state.chartId = action.payload.w_idx;
      state.modalStateType = "manage";
    },
    edit: (state) => {
      state.edit = [state.chartId];
    },
    setDefaultInfoWithGubun: (
      state,
      action: PayloadAction<{ gubun: Gubun; w_idx: number; p_idx: number }>
    ) => {
      const { gubun, p_idx, w_idx } = action.payload;
      switch (gubun) {
        case "pa": {
          state.tabType = "patient";
          break;
        }
        case "op": {
          state.tabType = "opinion";
          break;
        }
        case "pr": {
          state.tabType = "preliminary";
          break;
        }
        case "te": {
          state.tabType = "teleconsulting";
          break;
        }
        case "ca": {
          state.tabType = "carePlans";
          break;
        }
        case "vif": {
          state.tabType = "visitForm";
          break;
        }
        case "vii": {
          state.tabType = "visitInfo";
          break;
        }
        case "vir": {
          state.tabType = "visitResult";
          break;
        }
        case "poc": {
          state.tabType = "postConsulting";
          break;
        }
        case "pp": {
          state.tabType = "postPrescript";
          break;
        }
      }

      state.chartId = w_idx;
      state.patientId = p_idx;
      state.modalStateType = "manage";
    },
  },
});

export default workflowModalSlice;
export const workflowModalActions = { ...workflowModalSlice.actions };
