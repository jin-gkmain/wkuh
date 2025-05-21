import instance from '@/utils/myAxios';

export default async function getVideoFiles(
  v_idx: number,
) {
  const body = {
    v_idx
  };
  try {
    const res = await instance.post('/video_file_list', body);
    const data: MyResponse<ListRes<VideoFile>> = res.data;
    if (data.result) return data.result;
    else return [];
  } catch (err) {
    return 'ServerError';
  }
}

async function uploadVideoFiles(
  formData: FormData,
  v_idx: number,
) {
  formData.append('v_idx', v_idx.toString());

  try {
    const res = await instance.post('/video_file_upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return 'SUCCESS';
  } catch (err) {
    return 'ServerError';
  }
}

async function deleteVideoFile(vf_idx: number) {
  try {
    const res = await instance.post('/video_file_delete', { vf_idx });
    return 'SUCCESS';
  } catch (err) {
    return 'ServerError';
  }
}

async function downloadVideoFile(vf_idx: number) {
  try {
    const res = await instance.post('/video_file_download', { vf_idx });
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

export { getVideoFiles, uploadVideoFiles, deleteVideoFile, downloadVideoFile };
