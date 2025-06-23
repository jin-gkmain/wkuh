type Video = {
  v_idx: number; // 비디오 일련번호
  p_idx: number; // 환자 일련번호

  v_sep: "MRI" | "CT" | "X-RAY" | "ETC" | ""; // 비디오 구분

  di_hospital: string; // 진단 병원명
  di_doctor: string; // 진단 의사명
  di_date: string; // 진단 날짜
  di_memo: string | null; // 진단 메모

  videos: VideoFile[];
};

type VideoFile = {
  f_idx: number; // 파일 일련번호
  f_name: string; // 파일명
  f_path: string; // 파일 경로
  f_type: string; // 파일 타입
  f_size: number; // 파일 크기
  f_registdate: Date; // 파일 등록일
};

type VideoModal = {
  video: Video;
  patient: Patient;
};
