import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import DropFileInput from "../common/inputs/DropFileInput";
import ModalFrame from "../modal/ModalFrame";
import DateInput, { Value } from "../common/inputs/DateInput";
import SelectInput from "../common/inputs/SelectInput";
import FlagKoreaSq from "../common/icons/FlagKoreaSq";
import langFile from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";
import Select from "../common/inputs/Select";
import dayjs from "dayjs";
import { useAppSelector, useAppDispatch } from "@/store";
import { editOrg, registOrg } from "@/data/org";
import getFiles, { deleteFile, uploadFiles } from "@/data/file";
import getVideoFiles, {
  deleteVideoFile,
  uploadVideoFiles,
} from "@/data/video_file";
import { editVideo, registVideo, getVideo } from "@/data/video";
import { getPatient } from "@/data/patient";
import { videoActions } from "@/store/modules/videoSlice";
import DropVideoFileInput from "../common/inputs/DropVideoFileInput";

type Props = {
  item: Video | null;
  closeModal: () => void;
  type: ModalType;
  onComplete: (data?: any) => void;
};

function VideoModalBox({ closeModal, type, onComplete, item }: Props) {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { webLang } = useContext(LanguageContext);
  const dispatch = useAppDispatch();

  const [modalInfo, setModalInfo] = useState<VideoModal>({
    video: item || {
      v_idx: 0,
      p_idx: 0,
      di_hospital: "",
      di_doctor: "",
      di_date: "",
      di_memo: "",
      v_sep: "",
      videos: [],
    },
    patient: {
      p_idx: 0,
      o_idx: 0,
      nurse_idx: null,
      p_chart_no: null,
      u_name_eng: "",
      sex: "",
      birthday: "",
      weight: "",
      tall: "",
      tel: "",
      address: "",
      note: "",
      registdate_locale: new Date(),
      registdate_utc: new Date(),
      visit_paths: "",
      p_serial_no: "",

      nurse_name_eng: "",
      nurse_name_kor: "",
      p_email: "",
      p_id: "",
    },
  });

  const [inputAlert, setInputAlert] = useState({
    videos: false,
    gubun: false,
  });
  const [videos, setVideos] = useState<(File | VideoFile)[]>([]);

  const isSavedFile = (file: File | VideoFile): file is VideoFile => {
    return (
      (file as any).vf_idx !== undefined || (file as any).f_idx !== undefined
    );
  };

  const handleRemove = async (id: string) => {
    if (videos.length > 0 && isSavedFile(videos[0])) {
      const res = await deleteVideoFile(parseInt(id));
      if (res === "SUCCESS") {
        setVideos((prev) =>
          prev.filter((file) => {
            if ("f_idx" in file) {
              return file.f_idx.toString() !== id;
            } else {
              return ((file as any).file_name || (file as any).f_name) !== id;
            }
          })
        );
      }
    } else {
      setVideos((prev) =>
        prev.filter((file) => {
          if ("f_idx" in file) {
            return file.f_idx.toString() !== id;
          } else {
            return ((file as any).file_name || (file as any).f_name) !== id;
          }
        })
      );
    }
  };

  // 파일 설정
  const setSelectedFiles = async (acceptedFiles: File[]) => {
    if (type === "manage") {
      const formData = getFormDataWithFiles(acceptedFiles);
      const res = await uploadVideoFiles(
        formData,
        modalInfo.video.v_idx,
        userInfo.u_idx
      );
      if (res === "SUCCESS") {
        const res = await getVideoFiles(modalInfo.video.v_idx);
        if (res !== "ServerError") {
          setVideos(res);
        }
      }
    } else {
      if (!videos.length || !isSavedFile(videos[0])) {
        setVideos((prev) => [
          ...(prev as VideoFile[]),
          ...(acceptedFiles as unknown as VideoFile[]),
        ]);
      }
    }
  };

  // 날짜 선택
  const getDates = useCallback((dates: Value) => {
    if (Array.isArray(dates)) {
      setModalInfo((prev) => ({
        ...prev,
        contract_sd: dayjs(dates[0]!).format("YYYY.MM.DD"),
        contract_ed: dayjs(dates[1]!).format("YYYY.MM.DD"),
      }));
    }
  }, []);

  // 모달 필수항목 확인 - 영상 1개 이상 및 영상유형 체크
  const checkRequirements = () => {
    console.log("checkRequirements 시작, videos length:", videos.length);
    console.log("v_sep:", modalInfo.video.v_sep);
    let submitable = true;

    if (videos.length === 0) {
      console.log("영상이 없음");
      setInputAlert((prev) => ({ ...prev, videos: true }));
      submitable = false;
    } else {
      setInputAlert((prev) => ({ ...prev, videos: false }));
    }

    if (!modalInfo.video.v_sep || modalInfo.video.v_sep.trim() === "") {
      console.log("영상유형이 선택되지 않음");
      setInputAlert((prev) => ({ ...prev, gubun: true }));
      submitable = false;
    } else {
      setInputAlert((prev) => ({ ...prev, gubun: false }));
    }

    console.log("checkRequirements 결과:", submitable);
    return submitable;
  };

  // 전달받은 인자를 토대로 formData를 생성해 반환
  const getFormDataWithFiles = (acceptedFiles: (VideoFile | File)[]) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      if (!("f_idx" in file)) {
        formData.append("files", file as File);
      }
    });

    return formData;
  };

  // 비디오 등록, 수정
  const handleSubmit = async (ev: FormEvent) => {
    console.log("handleSubmit 시작");
    ev.preventDefault();
    const {
      video: { v_idx, p_idx, di_hospital, di_doctor, di_date, di_memo, v_sep },
    } = modalInfo;

    console.log("modalInfo.video:", modalInfo.video);
    console.log("type:", type);

    let submitable = checkRequirements();

    console.log("submitable:", submitable);
    if (!submitable) {
      console.log("validation 실패로 함수 종료");
      return;
    }

    if (type === "new") {
      // 새로 등록하는 경우
      let body: any = {
        p_idx,
        di_hospital,
        di_doctor,
        di_date: di_date || dayjs().format("YYYY-MM-DD"),
        di_memo,
        v_sep: v_sep,
        regist_u_idx: userInfo.u_idx,
      };
      if (body.di_doctor === "" || body.di_doctor === null) {
        body.di_doctor = "-";
      }
      if (body.di_hospital === "" || body.di_hospital === null) {
        body.di_hospital = "-";
      }
      if (body.di_memo === "" || body.di_memo === null) {
        body.di_memo = "-";
      }
      if (body.di_date === "" || body.di_date === null) {
        body.di_date = dayjs().format("YYYY-MM-DD");
      }

      const data = await registVideo(body);
      if (data.message === "SUCCESS") {
        if (videos.length > 0) {
          const formData = getFormDataWithFiles(videos);
          const res = await uploadVideoFiles(
            formData,
            data.v_idx,
            userInfo.u_idx
          );
          if (res === "SUCCESS") {
            // 새로 등록된 비디오 정보를 가져와서 Redux store에 추가
            const newVideo = await getVideo(data.v_idx);
            if (newVideo !== "ServerError" && newVideo) {
              dispatch(videoActions.addVideo(newVideo));
            }
            onComplete();
          } else {
            console.error("비디오 파일 업로드 실패:", res);
          }
        } else {
          // 파일이 없는 경우에도 비디오 정보를 Redux store에 추가
          const newVideo = await getVideo(data.v_idx);
          if (newVideo !== "ServerError" && newVideo) {
            dispatch(videoActions.addVideo(newVideo));
          }
          onComplete();
        }
      } else {
        console.error("비디오 등록 실패:", data);
      }
    } else {
      // 수정하는 경우
      let body: any = {
        p_idx,
        di_hospital: di_hospital || "-",
        di_doctor: di_doctor || "-",
        di_date: dayjs().format("YYYY-MM-DD"),
        di_memo: di_memo || "-",
        v_sep: v_sep,
      };
      console.log("body:", body, dayjs().format("YYYY-MM-DD"));

      const editResult = await editVideo(v_idx, body);
      if (editResult === "SUCCESS") {
        if (videos.length > 0) {
          const formData = getFormDataWithFiles(videos);
          const res = await uploadVideoFiles(formData, v_idx, userInfo.u_idx);
          if (res === "SUCCESS") {
            // 수정된 비디오 정보를 가져와서 Redux store 업데이트
            const updatedVideo = await getVideo(v_idx);
            if (updatedVideo !== "ServerError" && updatedVideo) {
              dispatch(videoActions.updateVideo(updatedVideo));
            }
            onComplete();
          } else {
            console.error("비디오 파일 업로드 실패:", res);
          }
        } else {
          // 파일이 없는 경우에도 비디오 정보를 Redux store에 업데이트
          const updatedVideo = await getVideo(v_idx);
          if (updatedVideo !== "ServerError" && updatedVideo) {
            dispatch(videoActions.updateVideo(updatedVideo));
          }
          onComplete();
        }
      } else {
        console.error("비디오 수정 실패:", editResult);
      }
    }
  };

  // input onChange시 변경된 값 반영
  const handleOnChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = ev.target;
    const { name, value } = target;
    setModalInfo((prev) => ({
      ...prev,
      video: { ...prev.video, [name]: value },
    }));
  };

  // item이 변경될 때 modalInfo 업데이트
  useEffect(() => {
    if (item?.p_idx) {
      getVideoFiles(item.v_idx).then((files) => {
        if (files !== "ServerError" && files) {
          console.log("가져온 files:", files);
          setVideos(files);
        }
      });
      getPatient(item.p_idx).then((patient) => {
        if (patient !== "ServerError" && patient) {
          setModalInfo({
            video: item,
            patient: patient,
          });
        }
      });
    }
  }, [item]);

  return (
    <div className="org-modal-box">
      <ModalFrame
        title={langFile[webLang].VIDEO_MODAL_TITLE_TEXT}
        completeBtnText={langFile[webLang].VIDEO_MODAL_COMPLETE_BUTTON_TEXT}
        onClose={closeModal}
        onComplete={handleSubmit}
      >
        <div className="input-col-wrap">
          <h3 className="section-title">
            {langFile[webLang].VIDEO_MODAL_PATIENT_INFO}
          </h3>

          <div className="input-row-wrap">
            <div className="input-col-wrap flex-1">
              <label htmlFor="u_name_eng" className="label">
                {langFile[webLang].VIDEO_MODAL_NAME}
              </label>
              <input
                autoComplete="off"
                value={modalInfo.patient.u_name_eng || ""}
                type="text"
                className="input"
                id="u_name_eng"
                name="u_name_eng"
                disabled
              />
            </div>

            <div className="input-col-wrap flex-1">
              <label className="label">
                {langFile[webLang].VIDEO_MODAL_AGE}
              </label>
              <input
                type="text"
                className="input"
                value={(() => {
                  if (!modalInfo.patient.birthday) return "";
                  const birthYear = parseInt(
                    modalInfo.patient.birthday.substring(0, 4)
                  );
                  const currentYear = new Date().getFullYear();
                  const age = currentYear - birthYear;
                  return isNaN(age) ? "" : age.toString();
                })()}
                disabled
              />
            </div>

            <div className="input-col-wrap flex-1">
              <label className="label">
                {langFile[webLang].VIDEO_MODAL_GENDER}
              </label>
              <input
                type="text"
                className="input"
                value={modalInfo.patient.sex || ""}
                disabled
              />
            </div>
          </div>

          <div className="input-row-wrap">
            <div className="input-col-wrap flex-1">
              <label className="label">
                {langFile[webLang].VIDEO_MODAL_BIRTHDAY}
              </label>
              <input
                type="text"
                className="input"
                value={modalInfo.patient.birthday || ""}
                disabled
              />
            </div>

            <div className="input-col-wrap flex-1">
              <label className="label">
                {langFile[webLang].VIDEO_MODAL_HEIGHT}
              </label>
              <input
                type="text"
                className="input"
                value={
                  modalInfo.patient.tall
                    ? modalInfo.patient.tall.toString()
                    : ""
                }
                disabled
              />
            </div>

            <div className="input-col-wrap flex-1">
              <label className="label">
                {langFile[webLang].VIDEO_MODAL_WEIGHT}
              </label>
              <input
                type="text"
                className="input"
                value={
                  modalInfo.patient.weight
                    ? modalInfo.patient.weight.toString()
                    : ""
                }
                disabled
              />
            </div>
          </div>
        </div>

        <div className="input-col-wrap">
          <h3 className="section-title">
            {langFile[webLang].VIDEO_MODAL_VIDEO_INFO}
          </h3>

          <div className="input-row-wrap">
            <div className="input-col-wrap flex-1">
              <label htmlFor="di_hospital" className="label">
                {langFile[webLang].VIDEO_MODAL_HOS_NAME_TEXT}
              </label>
              <input
                autoComplete="off"
                value={modalInfo.video.di_hospital || ""}
                onChange={handleOnChange}
                type="text"
                className="input"
                id="di_hospital"
                name="di_hospital"
              />
            </div>

            <div className="input-col-wrap flex-1">
              <label htmlFor="di_doctor" className="label">
                {langFile[webLang].VIDEO_MODAL_DOCTOR_TEXT}
              </label>
              <input
                autoComplete="off"
                value={modalInfo.video.di_doctor || ""}
                onChange={handleOnChange}
                type="text"
                className="input"
                id="di_doctor"
                name="di_doctor"
              />
            </div>
          </div>

          <div className="input-row-wrap">
            <div className="input-col-wrap flex-1">
              <label htmlFor="di_date" className="label">
                {langFile[webLang].VIDEO_MODAL_DIAGNOSIS_DATE_TEXT}
              </label>
              <input
                autoComplete="off"
                value={modalInfo.video.di_date}
                onChange={handleOnChange}
                type="date"
                className="input"
                id="di_date"
                name="di_date"
              />
            </div>
          </div>

          <div className="input-row-wrap">
            <div className="input-col-wrap flex-1">
              <label className="label" htmlFor="di_memo">
                {langFile[webLang].VIDEO_MODAL_MEMO_TEXT}
              </label>
              <textarea
                autoComplete="off"
                name="di_memo"
                id="di_memo"
                className="input"
                style={{ resize: "none", height: "100px" }}
                draggable={false}
                value={modalInfo.video.di_memo || ""}
                onChange={handleOnChange}
                rows={4}
                placeholder={langFile[webLang].VIDEO_MODAL_MEMO_PLACEHOLDER}
              />
            </div>
          </div>
        </div>

        <div className="input-col-wrap" style={{ marginTop: "20px" }}>
          <h3 className="section-title">
            {langFile[webLang].VIDEO_MODAL_ATTACH_VIDEO_FILE}
          </h3>

          <div className="input-row-wrap">
            <div className="input-col-wrap" style={{ width: "150px" }}>
              <label htmlFor="gubun" className="label">
                {langFile[webLang].VIDEO_MODAL_VIDEO_TYPE}
              </label>
              <div
                className={`select-wrapper ${
                  inputAlert.gubun ? "select-alert" : ""
                }`}
              >
                <Select
                  selectType="gubun"
                  options={[
                    { key: langFile[webLang].VIDEO_MODAL_SELECT, value: "" },
                    { key: langFile[webLang].VIDEO_MODAL_MRI, value: "MRI" },
                    { key: langFile[webLang].VIDEO_MODAL_CT, value: "CT" },
                    {
                      key: langFile[webLang].VIDEO_MODAL_X_RAY,
                      value: "X-RAY",
                    },
                    { key: langFile[webLang].VIDEO_MODAL_ETC, value: "ETC" },
                  ]}
                  selected={modalInfo.video.v_sep || ""}
                  setSelected={(selected: string) =>
                    setModalInfo((prev) => ({
                      ...prev,
                      video: {
                        ...prev.video,
                        v_sep: selected as Video["v_sep"],
                      },
                    }))
                  }
                />
              </div>
              {inputAlert.gubun && (
                <div
                  className="input-alert-text"
                  style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                >
                  {langFile[webLang].VIDEO_MODAL_VIDEO_TYPE_ALERT}
                </div>
              )}
            </div>
          </div>

          <DropVideoFileInput
            labelText={true}
            files={videos}
            setFiles={setSelectedFiles}
            onRemove={handleRemove}
            type="dicom"
          />
          {inputAlert.videos && (
            <div
              className="input-alert-text"
              style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
            >
              {langFile[webLang].VIDEO_MODAL_VIDEO_ALERT}
            </div>
          )}
          <div style={{ height: "100px" }}></div>
        </div>
      </ModalFrame>
    </div>
  );
}

export default React.memo(VideoModalBox);
