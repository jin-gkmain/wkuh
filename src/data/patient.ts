import instance from "@/utils/myAxios";

async function getPatients(o_idx: number, body: { [key: string]: any }) {
  try {
    const res = await instance.post("/patient_list", {
      o_idx: o_idx.toString(),
      search: "",
      search_key: "",
      search_p_chart_no: "",
      search_name: "",
      search_nurse: "",
      ...body,
    });

    const data: MyResponse<ListRes<Patient>> = res.data;
    if (data.result) {
      return data.result;
    } else {
      return [];
    }
  } catch (err) {
    return "ServerError";
  }
}

async function getPatient(p_idx: number) {
  try {
    const res = await instance.post("/patient_detail", { p_idx });

    const data: MyResponse<ListRes<Patient>> = res.data;

    if (data.result) {
      return data.result[0];
    } else {
      return null;
    }
  } catch (err) {
    return "ServerError";
  }
}

async function getPatientBySerialNo(p_serial_no: number, p_birthday: string) {
  try {
    const res = await instance.post("/patient_detail2", {
      p_serial_no,
      p_birthday,
    });

    const data: MyResponse<MobilePatient[]> = res.data;
    if (data.result) {
      return data.result[0];
    } else {
      return null;
    }
  } catch (err) {
    return "ServerError";
  }
}

async function deletePatient(p_idx: number) {
  try {
    const res = await instance.post("/patient_delete", {
      p_idx,
    });
    const data: MyResponse<SimpleRes> = res.data;

    if (data.result === "OK") {
      return "SUCCESS";
    } else {
      return "FAIL";
    }
  } catch (err) {
    return "ServerError";
  }
}

async function registPatient(
  o_idx: number,
  regist_u_idx: number,
  body: { [key: string]: any }
) {
  let reqBody = { ...body, o_idx, regist_u_idx };
  try {
    const res = await instance.post("/patient_regist", reqBody);
    const data: MyResponse<SimpleRes> = res.data;
    if (data.result === "OK") {
      return "SUCCESS";
    } else {
      return "FAIL";
    }
  } catch (err) {
    return "ServerError";
  }
}

async function editPatient(p_idx: number, body: { [key: string]: any }) {
  let reqBody = { ...body, p_idx };
  try {
    const res = await instance.post("/patient_edit", reqBody);
    const data: MyResponse<SimpleRes> = res.data;
    if (data.result === "OK") {
      return "SUCCESS";
    } else {
      return "FAIL";
    }
  } catch (err) {
    return "ServerError";
  }
}

export {
  getPatient,
  getPatients,
  getPatientBySerialNo,
  deletePatient,
  registPatient,
  editPatient,
};
