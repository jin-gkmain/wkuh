type Video = {
  v_idx: number; // 비디오 일련번호
  p_idx: number; // 환자 일련번호

  v_sep: "MRI" | "CT" | "X-RAY" | "ETC" | ""; // 비디오 구분

  di_hospital: string; // 진단 병원명
  di_doctor: string; // 진단 의사명
  di_date: string | Date; // 진단 날짜 (Redux store에서는 string, UI에서는 Date)
  di_memo: string | null; // 진단 메모
  registdate_utc: string | Date; // 등록일 (Redux store에서는 string, UI에서는 Date)
  videos: VideoFile[];
};

type VideoFile = {
  vf_idx: number; // 파일 일련번호
  file_name: string; // 파일명
  f_path: string; // 파일 경로
  f_type: string; // 파일 타입
  f_size: number; // 파일 크기
  f_registdate: string | Date; // 파일 등록일 (Redux store에서는 string, UI에서는 Date)
};

type VideoModal = {
  video: Video;
  patient: Patient;
};
