import instance from '@/utils/myAxios';

export default async function getOrgs(body?: {
  [key: string]: any;
}): Promise<Organization[] | 'ServerError'> {
  let org_data: Organization[] = [];
  let reqBody = {
    search: '',
    search_key: '',
  };
  try {
    const res = await instance.post('/org_list', { ...reqBody, ...body });
    const resData: MyResponse<ListRes<Organization>> = res.data;

    if (resData.result) {
      org_data = resData.result;
    }
    return org_data;
  } catch (err) {
    console.log('기관목록 불러오기 실패...');
    return 'ServerError';
  }
}

export async function getOrg(o_idx: number) {
  try {
    const res = await instance.post('/org_detail', {
      o_idx,
    });

    const data: MyResponse<ListRes<Organization>> = res.data;
    if (data.result) {
      return data.result[0];
    } else null;
  } catch (err) {
    return 'ServerError';
  }
}

export async function deleteOrg(o_idx: number) {
  try {
    const res = await instance.post('/org_delete', {
      o_idx,
    });
    const data: MyResponse<SimpleRes> = res.data;
    if (data.result === 'OK') {
      return 'SUCCESS';
    } else {
      return 'FAIL';
    }
  } catch (err) {
    return 'ServerError';
  }
}

export async function registOrg(
  parent_o_idx: number,
  regist_u_idx: number,
  body: { [key: string]: any }
) {
  let reqBody = { ...body, parent_o_idx, regist_u_idx };

  try {
    const res = await instance.post('/org_regist', reqBody);
    const data: MyResponse<SimpleRes> & { o_idx: number } = res.data;
    if (data.result === 'OK') {
      return { message: 'SUCCESS', o_idx: data.o_idx };
    } else {
      return { message: 'FAIL' };
    }
  } catch (err) {
    return { message: 'ServerError' };
  }
}

export async function editOrg(o_idx: number, body: { [key: string]: any }) {
  let reqBody = { o_idx, use_ch: 'y', ...body };

  try {
    const res = await instance.post('/org_edit', reqBody);
    const data: MyResponse<SimpleRes> = res.data;
    if (data.result === 'OK') {
      return 'SUCCESS';
    } else {
      return 'FAIL';
    }
  } catch (err) {
    return 'ServerError';
  }
}
