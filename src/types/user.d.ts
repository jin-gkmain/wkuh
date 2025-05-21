type User = {
  u_idx: number; // 사용자 일련번호
  o_idx: number; // 기관 일련번호
  u_code: string | null; // 사용자 코드
  p_idx: number | null; // 환자 일련번호
  u_name_kor: string | null; // 사용자명(한글)
  u_name_eng: string | null; // 사용자명(영어)
  u_id: string | null; // 이메일(ID)
  tel: string | null; // 연락처
  permission: string | null; // 권한
  job: string | null; // 직무
  note: string | null; // 메모
  registdate_local: Date; // local 등록시간
  registdate_utc: Date; // utc 등록시간
  use_ch: 'y' | 'n'; // 활성화, 비활성화
};

type UserModal = Omit<User, 'registdate_local' | 'registdate_utc' | 'use_ch'>;

type StoredUser = Omit<User, 'u_code' | 'registdate_local' | 'use_ch'> & {
  country: string | null;
};
