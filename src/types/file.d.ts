type SavedFile = {
  f_idx: number; // 파일 일련번호
  file_vol: number; // 파일 용량
  file_ori: string | null; // 파일명 ( 원문 )
  file_name: string; // 파일명 ( 난독화명 )
  cloud_link: string; // 클라우드 링크 주소
  regist_u_idx: string | null; // 등록자 idx
  registdate_utc: string; // 등록일(utc)
};

type Gubun1 =
  | '계약서'
  | '환자정보'
  | '치료계획서'
  | '소견서정보'
  | '내원준비'
  | '내원상담'
  | '내원결과'
  | '사후상담'
  | '사후처방'
  | '영상';

type Gubun2 =
  | '첨부'
  | '예약확인증'
  | '초청장'
  | '여권'
  | '신원확인서'
  | '재직증명서'
  | '차량정보'
  | '숙소정보'
  | '병원위치'
  | '처방전'
  | '개인정보 동의서'
  | '검사동의서'
  | '시술동의서'
  | '입원동의서'
  | '약처방';
