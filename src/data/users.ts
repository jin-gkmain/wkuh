import instance from '@/utils/myAxios';

// export default async function getUsers(body: {
//   [key: string]: any;
// }): Promise<User[] | 'ServerError'> {
//   // ✨ 해당 기관의 사용자 목록 불러오기
//   try {
//     const res = await instance.post('/user_list', body);

//     const data: MyResponse<ListRes<User>> = res.data;

//     if (data.result) {
//       return data.result;
//     } else {
//       return [];
//     }
//   } catch (err) {
//     return 'ServerError';
//   }
// }

async function getAllUsers(body?: { [key: string]: any }) {
  // ✨ 해당 기관의 사용자 목록 불러오기
  try {
    const res = await instance.post('/user_list', {
      search: '',
      search_key: '',
      ...body,
    });

    const data: MyResponse<ListRes<User>> = res.data;

    if (data.result) {
      return data.result;
    } else {
      return [];
    }
  } catch (err) {
    return 'ServerError';
  }
}

async function getUsersByOIdx(
  o_idx?: number,
  body?: { [key: string]: string }
): Promise<User[] | 'ServerError'> {
  // ✨ 해당 기관의 사용자 목록 불러오기
  try {
    const res = await instance.post('/user_list', {
      o_idx: o_idx || '',
      search: '',
      search_key: '',
      ...body,
    });

    const data: MyResponse<ListRes<User>> = res.data;

    if (data.result) {
      return data.result;
    } else {
      return [];
    }
  } catch (err) {
    return 'ServerError';
  }
}

async function deleteUser(u_idx: number) {
  try {
    const res = await instance.post('/user_delete', {
      u_idx,
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

async function registUser(
  o_idx: number,
  regist_u_idx: number,
  body: { [key: string]: any }
) {
  let reqBody = { ...body, o_idx, regist_u_idx };
  try {
    const res = await instance.post('/user_regist', reqBody);
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

async function editUser(u_idx: number, body: { [key: string]: any }) {
  let reqBody = { u_idx, use_ch: 'y', ...body };
  try {
    const res = await instance.post('/user_edit', reqBody);
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

export { getAllUsers, getUsersByOIdx, deleteUser, registUser, editUser };
