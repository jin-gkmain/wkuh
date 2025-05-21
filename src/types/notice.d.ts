type Notice = {
  n_idx: number; // 공지사항 번호
  o_idx: number; // 기관 번호
  title: string | null; // 제목
  content: string | null; // 내용
  regist_u_idx: number; // 작성자
  regist_name_kor: string | null; // 작성자
  regist_name_eng: string | null; // 작성자
  registdate_utc: Date; // utc 등록시간
};

type NoticeModal = Pick<Notice, 'n_idx' | 'title' | 'content'>;
