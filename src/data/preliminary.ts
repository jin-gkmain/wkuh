import instance from "@/utils/myAxios";

async function getPreliminariesByPIdx(p_idx: number) {
  try {
    const res = await instance.post("/preliminary_list", { p_idx });
    const data: { result: string; data: Preliminary[] } = res.data;
    if (data.result === "OK") {
      return data.data;
    } else {
      return [];
    }
  } catch (err) {
    return "ServerError";
  }
}

async function getPreliminaryByWIdx(w_idx: number) {
  try {
    const res = await instance.post("/preliminary_list", { w_idx: w_idx });

    const data: { result: string; data: Preliminary[] } = res.data;

    if (data.result === "OK") {
      return data.data[0];
    } else {
      return null;
    }
  } catch (err) {
    return "ServerError";
  }
}

async function getPreliminaryByPIdx(pl_idx: number) {
  try {
    const res = await instance.post("/preliminary_list", { pl_idx: pl_idx });
    const data: { result: string; data: Preliminary[] } = res.data;
    if (data.result === "OK") {
      return data.data[0];
    } else {
      return null;
    }
  } catch (err) {
    return "ServerError";
  }
}

async function deletePreliminary(pl_idx: number) {
  try {
    const res = await instance.post("/preliminary_delete", {
      pl_idx,
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

async function registPreliminary(body: Preliminary) {
  let reqBody = { ...body };
  try {
    const res = await instance.post("/preliminary_regist", reqBody);
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

async function editPreliminary(pl_idx: number, body: { [key: string]: any }) {
  let reqBody = { ...body, pl_idx };
  try {
    const res = await instance.post("/preliminary_edit", reqBody);
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
  getPreliminariesByPIdx,
  getPreliminaryByWIdx,
  getPreliminaryByPIdx,
  deletePreliminary,
  registPreliminary,
  editPreliminary,
};
