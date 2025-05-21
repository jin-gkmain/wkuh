import instance from '@/utils/myAxios';

export default async function getFiles(
  o_idx: number,
  gubun1: Gubun1,
  gubun2: Gubun2,
  w_idx?: number,
  pp_idx?: number
) {
  const body = {
    gubun1,
    gubun2,
    w_idx: w_idx ?? '',
    o_idx: o_idx ?? '',
    pp_idx: pp_idx ?? '',
  };
  try {
    const res = await instance.post('/file_list', body);
    const data: MyResponse<ListRes<SavedFile>> = res.data;
    if (data.result) return data.result;
    else return [];
  } catch (err) {
    return 'ServerError';
  }
}

async function uploadFiles(
  formData: FormData,
  o_idx: number,
  regist_u_idx: number,
  gubun1: Gubun1,
  gubun2: Gubun2,
  w_idx?: number,
  pp_idx?: number
) {
  formData.append('o_idx', o_idx.toString());
  formData.append('regist_u_idx', regist_u_idx.toString());
  formData.append('gubun1', gubun1);
  formData.append('gubun2', gubun2);

  if (w_idx) formData.append('w_idx', w_idx.toString());
  if (pp_idx) formData.append('pp_idx', pp_idx.toString());

  try {
    const res = await instance.post('/file_upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return 'SUCCESS';
  } catch (err) {
    return 'ServerError';
  }
}

async function deleteFile(f_idx: number) {
  try {
    const res = await instance.post('/file_delete', { f_idx });
    return 'SUCCESS';
  } catch (err) {
    return 'ServerError';
  }
}

async function downloadFile(f_idx: number) {
  try {
    const res = await instance.post('/file_download', { f_idx });
    const data: { file_url: string; file_name: string } = res.data;

    return {
      message: 'SUCCESS',
      file_url: data.file_url,
      file_name: data.file_name,
    };
  } catch (err) {
    return { message: 'ServerError' };
  }
}

export { uploadFiles, deleteFile, downloadFile };
