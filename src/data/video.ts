import instance from "@/utils/myAxios";

export default async function getVideoInfos(body?: {
  [key: string]: any;
}): Promise<Video[] | "ServerError"> {
  let video_data: Video[] = [];
  let reqBody = {
    search: "",
  };
  try {
    const res = await instance.post("/video_list", { ...reqBody, ...body });
    const resData: MyResponse<ListRes<Video>> = res.data;

    if (resData.result) {
      video_data = resData.result;
    }
    return video_data;
  } catch (err) {
    console.log("비디오 목록 불러오기 실패...");
    return "ServerError";
  }
}

export async function getVideo(v_idx: number) {
  try {
    const res = await instance.post("/video_detail", {
      v_idx,
    });

    const data: MyResponse<ListRes<Video>> = res.data;
    if (data.result) {
      return data.result[0];
    } else null;
  } catch (err) {
    return "ServerError";
  }
}

export async function deleteVideo(v_idx: number) {
  try {
    const res = await instance.post("/video_delete", {
      v_idx,
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

export async function registVideo(body: { [key: string]: any }) {
  let reqBody = { ...body };

  try {
    const res = await instance.post("/video_regist", reqBody);
    const data: MyResponse<SimpleRes> & { data: { v_idx: number } } = res.data;
    if (data.result === "OK") {
      console.log(data);
      return { message: "SUCCESS", v_idx: data.data.v_idx };
    } else {
      return { message: "FAIL" };
    }
  } catch (err) {
    return { message: err.response.data.message };
  }
}

export async function editVideo(v_idx: number, body: { [key: string]: any }) {
  let reqBody = { v_idx, use_ch: "y", ...body };

  try {
    const res = await instance.post("/video_edit", reqBody);
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

export async function getVideosByPatient(
  p_idx: number
): Promise<Video[] | "ServerError"> {
  try {
    const res = await instance.post("/video_list", {
      search: "p_idx",
      search_key: p_idx.toString(),
    });
    const resData: MyResponse<ListRes<Video>> = res.data;

    if (resData.result) {
      return resData.result;
    }
    return [];
  } catch (err) {
    console.log("환자별 비디오 목록 불러오기 실패...");
    return "ServerError";
  }
}
