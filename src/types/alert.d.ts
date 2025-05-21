import { Gubun } from '@/store/modules/workflowModalSlice';

type AlertStatus = 'create' | 'save' | 'regist' | 'complete';

type Alert = {
  w_idx: number;
  gubun: Gubun;
  status: AlertStatus;
  registdate_utc: string;
  regist_u_idx: null | number;
  nurse1_check: string;
  nurse2_check: string;
  doctor1_check: string;
  doctor2_check: string;
  nurse1_idx: null | number;
  nurse2_idx: null | number;
  doctor1_idx: null | number;
  doctor2_idx: null | number;
  regist_name_kor: string;
  regist_name_eng: string;
  nurse1_name_kor: string;
  nurse1_name_eng: string;
  nurse2_name_kor: string;
  nurse2_name_eng: string;
  doctor1_name_kor: string;
  doctor1_name_eng: string;
  doctor2_name_kor: string;
  doctor2_name_eng: string;
};

type ChatAlert = Alert & {
  chat_comment: string;
};

type SideWorkflowAlertType = Alert & {
  idx: number;
  p_idx: number;
  u_name_eng: string;
  p_chart_no: string;
};
