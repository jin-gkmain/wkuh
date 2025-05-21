import instance from '@/utils/myAxios';

async function getNoticeList(o_idx: number, body?: { [key: string]: any }) {
  try {
    const res = await instance.post('/notice_list', {
      o_idx,
      search: '',
      search_key: '',
      ...body,
    });

    const data: MyResponse<ListRes<Notice>> = res.data;
    if (data.result) {
      return data.result;
    } else return null;
  } catch (err) {
    console.log('공지 목록 500 에러', o_idx);
    return 'ServerError';
  }
}

async function getNotice(n_idx: number) {
  try {
    const res = await instance.post('/notice_detail', {
      n_idx,
    });

    const data: MyResponse<ListRes<Notice>> = res.data;
    if (data.result) {
      return data.result[0];
    } else return null;
  } catch (err) {
    console.log('공지 디테일 500 에러', n_idx);
    return 'ServerError';
  }
}

async function registNotice(body?: {
  [key: string]: any;
}): Promise<{ message: 'SUCCESS' | 'FAIL'; n_idx?: number }> {
  try {
    const res = await instance.post('/notice_regist', {
      ...body,
    });

    const data: MyResponse<SimpleRes> & { n_idx: number } = res.data;

    if (data.result === 'OK') {
      return { message: 'SUCCESS', n_idx: data.n_idx };
    } else return { message: 'FAIL' };
  } catch (err) {
    console.log('공지 등록 500 에러');
    return { message: 'FAIL' };
  }
}

async function editNotice(n_idx: number, body?: { [key: string]: any }) {
  try {
    const res = await instance.post('/notice_edit', {
      n_idx,
      ...body,
    });

    const data: MyResponse<SimpleRes> = res.data;

    if (data.result === 'OK') {
      return 'SUCCESS';
    } else return 'FAIL';
  } catch (err) {
    console.log('공지 등록 500 에러');
    return 'ServerError';
  }
}

async function deleteNotice(n_idx: number) {
  try {
    const res = await instance.post('/notice_delete', {
      n_idx,
    });

    const data: MyResponse<SimpleRes> = res.data;

    if (data.result === 'OK') {
      return 'SUCCESS';
    } else return 'FAIL';
  } catch (err) {
    console.log('공지 등록 500 에러');
    return 'ServerError';
  }
}

export default getNoticeList;
export { getNotice, registNotice, editNotice, deleteNotice };
