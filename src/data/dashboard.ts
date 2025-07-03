import instance from "@/utils/myAxios";
import { getWorkflowsByOrg } from "./workflow";

async function getTeleUsageList(o_idx?: number) {
  try {
    const res = await instance.post("/dash_te", { o_idx: o_idx || "" });
    const resData: MyResponse<ListRes<DefaultChartResType>> = res.data;

    if (resData.result) {
      return resData.result;
    } else return [];
  } catch (err) {
    console.log("대시보드 협진현황 목록 불러오기 실패...");
    return "ServerError";
  }
}

async function getPatientRegistList(o_idx?: number) {
  try {
    const res = await instance.post("/dash_patient", { o_idx: o_idx || "" });
    const resData: MyResponse<ListRes<DefaultChartResType>> = res.data;

    if (resData.result) {
      return resData.result;
    } else return [];
  } catch (err) {
    console.log("대시보드 환자등룍 현황 불러오기 실패...");
    return "ServerError";
  }
}

async function getUserListByJob(o_idx?: number) {
  try {
    const res = await instance.post("/dash_user", { o_idx: o_idx || "" });
    const resData: MyResponse<ListRes<UserChartResType>> = res.data;

    if (resData.result) {
      return resData.result;
    } else return [];
  } catch (err) {
    console.log("대시보드 사용자 현황 불러오기 실패...");
    return "ServerError";
  }
}

async function getTodayTelePatients(o_idx?: number) {
  try {
    const res = await instance.post("/dash_te_today", { o_idx: o_idx || "" });
    const resData: MyResponse<ListRes<TodayAppointmentPatientResType>> =
      res.data;

    if (resData.result) {
      return resData.result;
    } else return [];
  } catch (err) {
    console.log("대시보드 금일 협진환자 목록 불러오기 실패...");
    return "ServerError";
  }
}

async function getTodayVisitPatients(o_idx?: number) {
  try {
    const res = await instance.post("/dash_vii_today", { o_idx: o_idx || "" });
    const resData: MyResponse<ListRes<TodayAppointmentPatientResType>> =
      res.data;

    if (resData.result) {
      return resData.result;
    } else return [];
  } catch (err) {
    console.log("대시보드 금일 내원환자 목록 불러오기 실패...");
    return "ServerError";
  }
}

async function getPpRegistList(o_idx?: number) {
  try {
    const res = await instance.post("/dash_pp", { o_idx: o_idx || "" });
    const resData: MyResponse<ListRes<DefaultChartResType>> = res.data;

    if (resData.result) {
      return resData.result;
    } else return [];
  } catch (err) {
    console.log("대시보드 처방등록 목록 불러오기 실패...");
    return "ServerError";
  }
}

async function getCompletedVisitist(o_idx?: number) {
  try {
    const res = await instance.post("/dash_vir", { o_idx: o_idx || "" });
    const resData: MyResponse<ListRes<DefaultChartResType>> = res.data;

    if (resData.result) {
      return resData.result;
    } else return [];
  } catch (err) {
    console.log("대시보드 내원완료 목록 불러오기 실패...");
    return "ServerError";
  }
}

// type 에 따른 차트 정보 불러오기
async function getChartInfo(type: ChartType, o_idx?: number) {
  try {
    const res = await instance.post(`/dash_${type}`, { o_idx: o_idx || "" });
    const resData: MyResponse<ListRes<DefaultChartResType>> = res.data;
    console.log("resData", resData);
    if (resData.result) {
      return resData.result;
    } else return [];
  } catch (err) {
    console.log("대시보드 차트 목록 불러오기 실패...");
    return "ServerError";
  }
}

export {
  getTeleUsageList,
  getPatientRegistList,
  getUserListByJob,
  getTodayTelePatients,
  getTodayVisitPatients,
  getPpRegistList,
  getCompletedVisitist,
  getChartInfo,
};
