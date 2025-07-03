type DefaultChartResType = {
  o_idx: number;
  o_name_kor: string;
  o_name_eng: string;
  m1: number;
  m2: number;
  m3: number;
  m4: number;
  m5: number;
  m6: number;
  m7: number;
  m8: number;
  m9: number;
  m10: number;
  m11: number;
  m12: number;
};

type UserChartResType = {
  o_idx: number;
  o_name_kor: string;
  o_name_eng: string;
  doctor_count: number;
  nurse_count: number;
  patient_count: number;
  interpreter_count: number;
};

type TodayAppointmentPatientResType = {
  p_idx: number;
  o_idx: number;
  o_name_kor: string;
  o_name_eng: string;
  doctor1_name_kor: string;
  doctor1_name_eng: string;
  doctor2_name_kor: string;
  doctor2_name_eng: string;
  // p_name_kor: string;
  // p_name_eng: string;
  u_name_kor: string;
  u_name_eng: string;
  te_date: string;
  vii_tad: string;
};

type TodayTePateintResType = TodayAppointmentPatientResType & {
  te_date: string;
};

type TodayViiPateintResType = TodayAppointmentPatientResType & {
  vii_tad: string;
};

type ChartType = "te" | "post" | "vir" | "pp"; // 협진사용현황, 사전상담현황, 내원완료현황, 처방전현황
