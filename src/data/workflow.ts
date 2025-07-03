import instance from "@/utils/myAxios";

export default async function getWorkflows(p_idx: number) {
  try {
    const res = await instance.post("/workflow_list", {
      p_idx: p_idx.toString(),
      search: "",
      search_key: "",
    });

    const data: MyResponse<ListRes<Diagnosis>> = res.data;
    if (data.result) {
      return data.result;
    } else {
      return [];
    }
  } catch (err) {
    return "ServerError";
  }
}

async function getWorkflowsByOrg(o_idx: number) {
  try {
    const res = await instance.post("/workflow_list", {
      search: "o_idx",
      search_key: o_idx.toString(),
    });

    const data: MyResponse<ListRes<Diagnosis>> = res.data;
    if (data.result) {
      return data.result;
    } else {
      return [];
    }
  } catch (err) {
    return "ServerError";
  }
}

async function getWorkflow(w_idx: number) {
  try {
    const res = await instance.post("/workflow_detail", {
      w_idx,
    });

    const data: MyResponse<ListRes<Diagnosis>> = res.data;
    if (data.result) {
      return data.result[0];
    } else {
      return null;
    }
  } catch (err) {
    return "ServerError";
  }
}

async function deleteWorkflow(w_idx: number) {
  try {
    const res = await instance.post("/workflow_delete", {
      w_idx,
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

async function registWorkflow(
  o_idx: number,
  p_idx: number,
  regist_u_idx: number,
  body?: { [key: string]: any }
) {
  try {
    const res = await instance.post("/workflow_regist", {
      o_idx,
      p_idx,
      regist_u_idx,
    });
    const data: MyResponse<SimpleRes> & { w_idx: number } = res.data;

    if (data.result === "OK") {
      return { message: "SUCCESS", w_idx: data.w_idx };
    } else {
      return { message: "FAIL" };
    }
  } catch (err) {
    return { message: "ServerError" };
  }
}

async function editWorkflow(
  w_idx: number,
  regist_u_idx: number,
  body?: { [key: string]: any }
) {
  try {
    const res = await instance.post("/workflow_edit", {
      w_idx,
      regist_u_idx,
      ...body,
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

async function getPostPrescriptions(w_idx: number) {
  try {
    const res = await instance.post("/workflow_pp_list", {
      w_idx,
      search: "",
      search_key: "",
    });
    const data: MyResponse<ListRes<PostPrescription>> = res.data;

    if (data.result) {
      return data.result;
    } else {
      return [];
    }
  } catch (err) {
    return "ServerError";
  }
}

async function getPostPrescription(pp_idx: number) {
  try {
    const res = await instance.post("/workflow_pp_detail", {
      pp_idx,
    });
    const data: MyResponse<ListRes<PostPrescriptionDetail>> = res.data;

    if (data.result) {
      return data.result[0];
    } else {
      return null;
    }
  } catch (err) {
    return "ServerError";
  }
}

async function registPostPrescription(
  o_idx: number,
  w_idx: number,
  regist_u_idx: number,
  body: { [key: string]: any }
) {
  try {
    const res = await instance.post("/workflow_pp_regist", {
      w_idx,
      regist_u_idx,
      o_idx,
      ...body,
    });
    const data: MyResponse<SimpleRes> & { pp_idx: number } = res.data;

    if (data.result === "OK") {
      return { message: "SUCCESS", pp_idx: data.pp_idx };
    } else {
      return { message: "FAIL" };
    }
  } catch (err) {
    return { message: "ServerError" };
  }
}

async function editPostPrescription(
  pp_idx: number,
  body?: { [key: string]: any }
) {
  try {
    const res = await instance.post("/workflow_pp_edit", {
      pp_idx,
      ...body,
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

async function deletePostPrescription(pp_idx: number) {
  try {
    const res = await instance.post("/workflow_pp_delete", {
      pp_idx,
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

export {
  deleteWorkflow,
  registWorkflow,
  editWorkflow,
  getWorkflow,
  getPostPrescriptions,
  getPostPrescription,
  registPostPrescription,
  editPostPrescription,
  deletePostPrescription,
  getWorkflowsByOrg,
};
