import { Gubun } from '@/store/modules/workflowModalSlice';
import { ChatAlert, SideWorkflowAlertType } from '@/types/alert';
import instance from '@/utils/myAxios';

async function registAlert(
  w_idx: number,
  gubun: Gubun,
  status?: 'regist' | 'complete' | 'save',
  optionalBody?: { [key: string]: string }
) {
  try {
    let body: any = { w_idx, gubun, ...optionalBody };

    if (status) body.status = status;
    const res = await instance.post('/side_regist', body);

    const data: MyResponse<SimpleRes> = res.data;
    if (data.result === 'OK') {
      return 'SUCCESS';
    } else return 'FAIL';
  } catch (err) {
    console.log('알림 등록 500 에러', w_idx, gubun);
    return 'ServerError';
  }
}

async function getAlertList(w_idx: number, ord: 'status' | 'chat' | 'all') {
  try {
    const res = await instance.post('/side_status', {
      w_idx,
      ord,
    });

    const data: MyResponse<ListRes<ChatAlert>> = res.data;
    if (data.result) {
      return data.result.map((i) => ({
        ...i,
        registdate_utc: new Date(i.registdate_utc + ' UTC').toISOString(),
      }));
    } else return [];
  } catch (err) {
    console.log('알림 목록 500 에러', w_idx, ord);
    return 'ServerError';
  }
}

async function getSideTeAptList<T>() {
  try {
    const res = await instance.post('/side_te');
    const data: MyResponse<ListRes<T>> = res.data;
    if (data.result) {
      return data.result;
    } else {
      return [];
    }
  } catch (err) {
    console.log('협진일정 데이터 목록 불러오기 에러');
    return 'ServerError';
  }
}

async function getSideViiAptList<T>() {
  try {
    const res = await instance.post('/side_vii');
    const data: MyResponse<ListRes<T>> = res.data;
    if (data.result) {
      return data.result;
    } else {
      return [];
    }
  } catch (err) {
    console.log('협진일정 데이터 목록 불러오기 에러');
    return 'ServerError';
  }
}

async function getSideWorkflowAlarm() {
  try {
    const res = await instance.post('/side_alarm');
    const data: MyResponse<ListRes<SideWorkflowAlertType>> = res.data;
    if (data.result) {
      return data.result.map((i) => ({
        ...i,
        registdate_utc: new Date(i.registdate_utc + ' UTC').toISOString(),
      }));
    } else return [];
  } catch (err) {
    console.log('사이드바 워크플로우 알람 목록 불러오기 실패');
    return 'ServerError';
  }
}

async function readSideWorkflowAlarm(idx: number) {
  try {
    const res = await instance.post('/side_read', { idx });
    const data: MyResponse<SimpleRes> = res.data;
    if (data.result === 'OK') {
      return 'SUCCESS';
    } else return 'FAIL';
  } catch (err) {
    console.log('사이드바 워크플로우 알람 읽음처리 실패');
    return 'ServerError';
  }
}

async function readAllSideWorkflowAlarm() {
  try {
    const res = await instance.post('/side_read_all');
    const data: MyResponse<SimpleRes> = res.data;
    if (data.result === 'OK') {
      return 'SUCCESS';
    } else return 'FAIL';
  } catch (err) {
    console.log('사이드바 워크플로우 알람 전체 읽음처리 실패');
    return 'ServerError';
  }
}

export default registAlert;
export {
  getAlertList,
  getSideTeAptList,
  getSideViiAptList,
  getSideWorkflowAlarm,
  readSideWorkflowAlarm,
  readAllSideWorkflowAlarm,
};
