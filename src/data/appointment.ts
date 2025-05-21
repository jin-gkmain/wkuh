import instance from '@/utils/myAxios';

async function getAppointmentList(
  o_idx: number,
  body?: { [key: string]: any }
) {
  try {
    const res = await instance.post('/appointment_list', {
      o_idx,
      ...body,
    });

    const data: MyResponse<ListRes<Appointment>> = res.data;
    if (data.result) {
      return data.result;
    } else return [];
  } catch (err) {
    console.log('일정 목록 500 에러', o_idx);
    return 'ServerError';
  }
}

export default getAppointmentList;
