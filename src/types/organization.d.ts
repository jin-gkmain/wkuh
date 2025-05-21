// 기관 type
type Organization = {
  o_idx: number; // 기관 일련번호
  u_idx: number; // 담당자 (기관관리자)
  o_code: string | null; // 기관코드(접두사)
  parent_o_idx: number | null; // 소속 상위기관 일련번호
  o_name_kor: string | null; // 기관명(한글)
  o_name_eng: string | null; // 기관명(영어)
  country: string | null; // 국가
  domain: string | null; // 도메인
  contract_sd: string | null; // 계약 시작일
  contract_ed: string | null; // 계약 종료일
  contract_email: string | null; // 기관 담당자 이메일
  contract_tel: string | null; // 기관담당자 연락처
  note: string | null; // 메모
  registdate_local: Date; // local 등록시간
  registdate_utc: Date; // utc 등록시간

  completed_tele_number: number | null; // 완료 협진수
  completed_visit_number: number | null; // 완료 내원수
  u_number: number | null; // 사용자수
  p_number: number | null; // 환자수
  u_name_kor: string; // 기관 담당자 이름 (국문)
  u_name_eng: string; // 기관 담당자 이름 (영문)
  use_ch: 'y' | 'n'; // 활성화, 비활성화
  qr_code: string | null;
};

type OrganizationInfo = Pick<
  Organization,
  | 'u_number'
  | 'p_number'
  | 'completed_tele_number'
  | 'completed_visit_number'
  | 'contract_email'
  | 'o_name_eng'
  | 'o_name_kor'
> & { duration: string };

type OrganizationModal = Omit<
  Organization,
  | 'registdate_local'
  | 'registdate_utc'
  | 'completed_tele_number'
  | 'completed_visit_number'
  | 'u_number'
  | 'p_number'
  | 'use_ch'
>;

type OrganizationDropdown = Pick<
  Organization,
  'o_idx' | 'o_name_eng' | 'o_name_kor'
>;
