type Patient = {
  p_idx: number; // 환자 일련번호
  o_idx: number; // 기관 일련번호
  nurse_idx: number | null; // 담당 간호사
  p_chart_no: number | null; // 환자번호 ( 기관코드 접두사-차트번호 )
  // u_name_kor: stirng | null; // 사용자명(한글)
  u_name_eng: string | null; // 사용자명(영어)
  sex: string | null; // 성별
  birthday: string | null; // 생년월일
  weight: string | null; // 몸무게
  tall: string | null; // 신장
  tel: string | null; // 연락처
  address: string | null; // 집주소
  note: string | null; // 메모
  registdate_locale: string | Date; // local 등록시간 (Redux store에서는 string, UI에서는 Date)
  registdate_utc: string | Date; // utc 등록시간 (Redux store에서는 string, UI에서는 Date)
  visit_paths: string | null; // 내원 경로
  p_serial_no: string | null; // 환자 일련번호(사용자 입력)

  nurse_name_eng: string | null;
  nurse_name_kor: stirng | null;
  p_email: string | null;
  p_id: stirng | null;
};

type MobilePatient = {
  p_birthday: string;
  p_idx: number;
  p_name_eng: string;
  p_sex: string;
  p_tall: string;
  p_weight: string;
};

type PatientModal = Omit<
  Patient,
  "o_idx" | "registdate_locale" | "registdate_utc"
>;
