type Diagnosis = {
  w_idx: number; // 진료 일련번호
  w_code: string | null; // 진료코드 ( 기관코드_W_일련번호5자리)
  o_idx: number; // 기관 일련번호
  p_idx: number; // 환자 일련번호

  pa_symptoms: string; // 환자정보_증상
  pa_diagnosis: string; // 환자정보_진단명
  pa_care_sofar: string; // 환자정보_환자가받은치료
  pa_care_korea: string; // 환자정보_한국에서받길원하는치료

  nurse1_idx: number | null; // 환자정보_간호사1
  nurse2_idx: number | null; // 환자정보_간호사2
  doctor1_idx: number | null; // 환자정보_의사1
  doctor2_idx: number | null; // 환자정보_의사2

  nurse1_name_kor: string | null;
  nurse1_name_eng: string | null;
  nurse2_name_kor: string | null;
  nurse2_name_eng: string | null;
  doctor1_name_kor: string | null;
  doctor1_name_eng: string | null;
  doctor2_name_kor: string | null;
  doctor2_name_eng: string | null;

  pa_medical_history11: string | null; // 환자정보_가족력_고혈압
  pa_medical_history12: string | null; // 환자정보_가족력_당뇨
  pa_medical_history13: string | null; // 환자정보_가족력_결핵
  pa_medical_history14: string | null; // 환자정보_가족력_암
  pa_medical_history15: string | null; // 환자정보_가족력_기타
  pa_medical_history16: string | null; // 환자정보_가족력_기타메모
  pa_medical_history21: string | null; // 환자정보_과거력_고혈압
  pa_medical_history22: string | null; // 환자정보_과거력_당뇨
  pa_medical_history23: string | null; // 환자정보_과거력_결핵
  pa_medical_history24: string | null; // 환자정보_과거력_암
  pa_medical_history25: string | null; // 환자정보_과거력_기타
  pa_medical_history26: string | null; // 환자정보_과거력_기타메모
  pa_surgical_history: string | null; //환자정보_수술력
  pa_medicine_history: string | null; //환자정보_약물력
  pa_allergy: string | null; // 환자정보_알러지정보

  op_contents: string | null; // 소견서정보_소견내용

  te_date: Date | null; // 원격협진_협진일시
  te_link: string | null; // 원격협진_참여링크

  ca_patient_status_summary: string | null; // 치료계획서_요약
  ca_doctor_idx: number | null; // 치료계획서_의사
  ca_doctor_name_eng: string | null;
  ca_doctor_name_kor: string | null;

  ca_department: string | null; // 치료계획서_진료과
  ca_diagnosis: string | null; // 치료계획서_진단내용
  ca_plan: string | null; // 치료계획서_치료계획
  ca_period_cost: string | null; // 치료계획서_기간_예상비용
  ca_caution: string | null; // 치료계획서_주의사항
  ca_cost_detail: string | null; // 치료계획서_비용내역

  vif_ho: string | null; // 내원준비_입원여부
  vif_pr: string | null; // 내원준비_선호병실
  vif_ve: string | null; // 내원준비_차량여부
  vif_with: string | null; // 내원준비_동반자여부
  vif_other: string | null; // 내원준비_기타주의사항

  vii_tad: Date | null; // 내원상담_진료예약일
  vii_cost: string | null; // 내원상담_내원진료비
  vii_precaution: string | null; // 내원상담_외래방문시주의사항
  vii_other: string | null; // 내원상담_기타안내사항
  vii_vi_yn: string | null; // 내원상담_내원여부
  vii_vi_memo: string | null; // 내원상담_내원여부_사유

  vir_other: string | null; // 내원결과_기타특이사항

  poc_current_status: string | null; // 사후상담_현재상태
  poc_progression: string | null; // 사후상담_경과
  poc_needed: string | null; // 사후상담_필요약품

  registdate_local: Date; // local 등록시간
  registdate_utc: Date; // utc 등록시간

  vif_health_screening_11: string | null; // 내원준비_건강검진신청항목_기본종합검진
  vif_health_screening_12: string | null; // 내원준비_건강검진신청항목_소화기전문검진
  vif_health_screening_13: string | null; // 내원준비_건강검진신청항목_심혈관전문검진
  vif_health_screening_14: string | null; // 내원준비_건강검진신청항목_폐전문검진
  vif_health_screening_15: string | null; // 내원준비_건강검진신청항목_뇌혈관전문검진
  vif_health_screening_16: string | null; // 내원준비_건강검진신청항목_부인암전문검진
  vif_health_screening_17: string | null; // 내원준비_건강검진신청항목_프리미엄

  vif_health_screening_21: string | null; // 내원준비_건강검진신청항목_CT(뇌)
  vif_health_screening_22: string | null; // 내원준비_건강검진신청항목_CT(가슴)
  vif_health_screening_23: string | null; // 내원준비_건강검진신청항목_CT(복부골반)
  vif_health_screening_24: string | null; // 내원준비_건강검진신청항목_CT(심장관상동맥)
  vif_health_screening_25: string | null; // 내원준비_건강검진신청항목_MRI(뇌)
  vif_health_screening_26: string | null; // 내원준비_건강검진신청항목_MRI(요추)
  vif_health_screening_27: string | null; // 내원준비_건강검진신청항목_MRI(자궁경부)
  vif_health_screening_28: string | null; // 내원준비_건강검진신청항목_MRI/MRA(뇌)
  vif_health_screening_29: string | null; // 내원준비_건강검진신청항목_초음파(골반)
  vif_health_screening_30: string | null; // 내원준비_건강검진신청항목_초음파(가슴)
  vif_health_screening_31: string | null; // 내원준비_건강검진신청항목_초음파(갑상선)
  vif_health_screening_32: string | null; // 내원준비_건강검진신청항목_초음파(경동맥)
  vif_health_screening_33: string | null; // 내원준비_건강검진신청항목_초음파(심장)
  vif_health_screening_34: string | null; // 내원준비_건강검진신청항목_초음파(전립선)
  vif_health_screening_35: string | null; // 내원준비_건강검진신청항목_PET-CT(뇌)
  vif_health_screening_36: string | null; // 내원준비_건강검진신청항목_PET-CT(몸통)
  vif_health_screening_37: string | null; // 내원준비_건강검진신청항목_PET-CT(뇌몸통)

  update_registdate_utc: string | null;
};

type PostPrescription = {
  pp_idx: number; // 사후처방_일련번호
  w_idx: number; // 진료_일련번호
  request_type: string | null; // 요청유형
  request_date: Date | null; // 요청일
  request_memo: string | null; // 요청사항
  p_chart_no: string | null; // 환자번호
  status: string | null; // 처방내용_상태
  registdate_utc: Date; // utc_등록시간
  regist_name_kor: string | null; // 작성자 국문 이름
  regist_name_eng: string | null; // 작성자 영문 이름
};

type PostPrescriptionDetail = Omit<
  PostPrescription,
  "regist_name_kor" | "regist_name_eng"
> & {
  regist_u_name_kor: string;
  regist_u_name_eng: string;
};

type PostPrescriptionModal = Omit<
  PostPrescription,
  | "w_idx"
  | "p_chart_no"
  | "registdate_utc"
  | "regist_name_kor"
  | "regist_name_eng"
>;

type DiagnosisModal = Omit<
  Diagnosis,
  "registdate_local" | "registdate_utc" | "update_registdate_utc"
>;
