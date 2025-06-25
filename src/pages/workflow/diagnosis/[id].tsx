import Layout from "@/components/common/Layout";
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import AddButton from "@/components/common/inputs/AddButton";
import { WorkflowModalContext } from "@/context/WorkflowModalContext";
import TableHead from "@/components/common/table/TableHead";
import TableRow from "@/components/common/table/TableRow";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import InfoBox, { InfoBoxType } from "@/components/common/InfoBox";
import { useAppDispatch } from "@/store";
import { workflowModalActions } from "@/store/modules/workflowModalSlice";
import { videoActions } from "@/store/modules/videoSlice";
import FlagKoreaSq from "@/components/common/icons/FlagKoreaSq";
import FlagMongolSq from "@/components/common/icons/FlagMongolSq";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import langFile from "@/lang";
import useModal from "@/hooks/useModal";
import useAlertModal from "@/hooks/useAlertModal";
import ConfirmAlertBox from "@/components/common/ConfirmAlertBox";
import CheckAlertbox from "@/components/common/CheckAlertBox";
import getTableRowMenuOptions from "@/utils/table";
import { convertTimeToStr } from "@/utils/date";
import dayjs from "dayjs";
import { getPatients, getPatient } from "@/data/patient";
import getWorkflows, { deleteWorkflow, getWorkflow } from "@/data/workflow";
import { useAppSelector } from "@/store";
import { registWorkflow } from "../../../data/workflow";
import MyHead from "@/components/common/MyHead";
import Tab from "@/components/common/Tab";
import {
  getVideo,
  registVideo,
  getVideosByPatient,
  deleteVideo,
} from "@/data/video";
import VideoModal from "@/components/modal/VideoModal";

export default function DiagnosisPage() {
  const mounted = useRef(false);
  const { userInfo } = useAppSelector(({ user }) => user);
  const { edit } = useAppSelector(({ workflowModal }) => workflowModal);
  const { videos, selectedVideo, isModalOpen } = useAppSelector(
    ({ video }) => video
  );

  const { webLang } = useContext(LanguageContext);
  const { openModal: openWorkflowModal } = useContext(WorkflowModalContext);
  const {
    ModalPortal: DeleteModalPortal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const { AlertModalPortal, openAlertModal, closeAlertModal } = useAlertModal();
  const {
    AlertModalPortal: VideoDeleteAlertModalPortal,
    openAlertModal: openVideoDeleteAlertModal,
    closeAlertModal: closeVideoDeleteAlertModal,
  } = useAlertModal();
  const {
    AlertModalPortal: VideoAddAlertModalPortal,
    openAlertModal: openVideoAddAlertModal,
    closeAlertModal: closeVideoAddAlertModal,
  } = useAlertModal();
  const selectedChart = useRef(0);
  const selectedVideoId = useRef(0);

  const {
    ModalPortal: DeleteVideoModalPortal,
    openModal: openDeleteVideoModal,
    closeModal: closeDeleteVideoModal,
  } = useModal();

  const dispatch = useAppDispatch();
  const [tableDropOptions, setTableDropOptions] = useState<TableMenuOption[]>(
    []
  );
  const [videoTableDropOptions, setVideoTableDropOptions] = useState<
    TableMenuOption[]
  >(["remove"]); // 테스트용으로 기본값 설정

  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null);
  const [infoKeys, setInfoKeys] = useState(() => getInfoBoxHeadData(webLang));

  const medicaltds = getTableMedicalHeadData(webLang);
  const videotds = getTableVideoHeadData(webLang);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("tab")) {
      router.push(`/workflow/diagnosis/${router.query.id}?tab=medical`);
    }
  }, [searchParams, router.query.id]);

  const openWorkflowModalHandler = (diagnosisId: number) => {
    if (patientInfo) {
      dispatch(workflowModalActions.setTabType("patient"));
      dispatch(
        workflowModalActions.manageChart({
          p_idx: patientInfo.p_idx,
          w_idx: diagnosisId,
        })
      );
      openWorkflowModal();
    }
  };

  const setChartIdAndOpenAlert = (type: string, chartId: number) => {
    selectedChart.current = chartId;
    openDeleteModal();
  };

  const deleteDiagnosis = async () => {
    const res = await deleteWorkflow(selectedChart.current);
    if (res === "SUCCESS") {
      setDiagnosis((prev) =>
        prev.filter((d) => d.w_idx !== selectedChart.current)
      );
      closeDeleteModal();
      openAlertModal();
    } else {
      console.log("진료 삭제 실패");
    }
  };

  const setVideoIdAndOpenAlert = (videoId: number) => {
    selectedVideoId.current = videoId;
    openDeleteVideoModal();
  };

  const deleteVideoHandler = async () => {
    const res = await deleteVideo(selectedVideoId.current);
    if (res === "SUCCESS") {
      // Redux store에서 삭제된 비디오 제거
      dispatch(videoActions.removeVideo(selectedVideoId.current));
      closeDeleteVideoModal();
      openVideoDeleteAlertModal();

      // 비디오 목록 새로고침
      if (patientInfo) {
        const v = await getVideosByPatient(patientInfo.p_idx);
        if (v !== "ServerError") {
          const newV = v.filter((item) => item.p_idx === patientInfo.p_idx);
          dispatch(videoActions.setVideos(newV));
        }
      }
    } else {
      console.log("비디오 삭제 실패");
    }
  };

  const addChart = async () => {
    if (!confirm(langFile[webLang].WORKFLOW_CONFIRM_ADD_CHART)) {
      return;
    }
    if (!patientInfo) {
      console.error("환자 정보가 없습니다.");
      return;
    }

    const res = await registWorkflow(
      patientInfo.o_idx,
      patientInfo.p_idx,
      userInfo.u_idx
    );

    if (res.message === "SUCCESS") {
      const w = await getWorkflow(res.w_idx);
      if (w !== "ServerError") {
        setDiagnosis((prev) => [w, ...prev]);
        dispatch(
          workflowModalActions.addChart({
            w_idx: res.w_idx,
            p_idx: patientInfo.p_idx,
          })
        );
        openWorkflowModal();
        console.log("변경된 진료정보 불러오기 성공");
      } else {
        console.log("변경된 진료정보 불러오기 실패");
      }
    } else {
      console.log("진료 생성 실패");
    }
  };

  const addVideo = () => {
    if (!patientInfo) {
      return;
    }

    // 새로 등록할 비디오의 기본 템플릿
    const newVideoTemplate: Video = {
      v_idx: 0, // 새로 생성할 때는 0
      p_idx: patientInfo.p_idx,
      v_sep: "",
      di_hospital: "",
      di_doctor: "",
      di_date: dayjs().toISOString(),
      di_memo: "",
      registdate_utc: dayjs().toISOString(),
      videos: [],
    };

    // 환자 정보와 함께 모달 열기
    dispatch(videoActions.setPatientId(patientInfo.p_idx));
    dispatch(videoActions.openModal({ video: newVideoTemplate, type: "new" }));
  };

  const handleTabClick = (tab: string) => {
    router.push(`/workflow/diagnosis/${router.query.id}?tab=${tab}`);
  };

  useEffect(() => {
    if (!userInfo) return;

    let p_idx = router.query.id as string;
    if (Array.isArray(p_idx)) return;

    const fetchInfo = async () => {
      if (userInfo.country === "korea") {
        const p = await getPatient(parseInt(p_idx));
        if (p === "ServerError") {
          console.log("한국 > 환자정보 불러오기 실패");
        } else {
          if (p) {
            setPatientInfo(p);
          } else {
            console.log("해당하는 환자 없음");
            return router.replace("/workflow");
          }
        }
      } else {
        const res = await getPatients(userInfo.o_idx, {
          search: "p_idx",
          search_key: p_idx,
        });

        if (res === "ServerError") {
          console.log("몽골 > 환자정보 불러오기 실패 / 500");
        } else {
          if (res.length) {
            setPatientInfo(res[0]);
          } else {
            console.log("소속되지 않은 환자");
            if (userInfo.p_idx) {
              return router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
            } else return router.replace("/workflow");
          }
        }
      }

      const w = await getWorkflows(parseInt(p_idx));
      if (w !== "ServerError" && w.length) {
        setDiagnosis(w);
      }

      const v = await getVideosByPatient(parseInt(p_idx));

      if (v !== "ServerError") {
        let newV = v.filter((item) => item.p_idx === parseInt(p_idx));
        dispatch(videoActions.setVideos(newV));
      }
    };

    if (userInfo.p_idx && userInfo.p_idx !== parseInt(p_idx)) {
      router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
    } else {
      fetchInfo();
    }
  }, [userInfo, router.query.id]);

  useEffect(() => {
    const newInfoKeys = getInfoBoxHeadData(webLang);
    setInfoKeys(newInfoKeys);
  }, [webLang]);

  useEffect(() => {
    if (userInfo) {
      let { country, permission } = userInfo;
      let dropOptions = [];
      let videoDropOptions = [];

      console.log("country 체크:", country === "korea");
      if (country === "korea") {
        console.log("한국 사용자입니다");
        if (permission === "admin") {
          dropOptions.push("remove");
          console.log("admin 권한으로 dropOptions에 remove 추가");
        }
      } else {
        console.log("한국 사용자가 아닙니다:", country);
      }

      // 비디오는 모든 사용자가 삭제 가능 (테스트용)
      videoDropOptions.push("remove");
      console.log("videoDropOptions에 remove 추가 (모든 사용자)");

      setTableDropOptions(dropOptions);
      setVideoTableDropOptions(videoDropOptions);
      console.log("tableDropOptions:", dropOptions);
      console.log("videoTableDropOptions:", videoDropOptions);
      console.log("userInfo:", userInfo);
      console.log("userInfo.country:", userInfo.country);
      console.log("userInfo.permission:", userInfo.permission);
    }
  }, [userInfo]);

  const tabs = [
    {
      tab: "medical",
      text: langFile[webLang].WORKFLOW_MENU_1,
    },
    {
      tab: "video",
      text: langFile[webLang].WORKFLOW_MENU_2,
    },
  ];

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      (async () => {
        if (edit && edit[0]) {
          const res = await getWorkflow(edit[0]);
          if (res !== "ServerError" && res) {
            const editedDiagnosis = diagnosis.map((d) =>
              d.w_idx === edit[0] ? { ...res } : d
            );
            setDiagnosis(editedDiagnosis);
            console.log("변경됨 > 변경된 진료 정보 불러오기");
          } else {
            console.log("변경된 진료목록 불러오기 실패");
          }
        }
      })();
    }
  }, [edit]);

  return (
    <div className="diagnosis-page page-contents">
      <MyHead subTitle="workflows" />

      <DeleteModalPortal>
        <ConfirmAlertBox
          handleClose={closeDeleteModal}
          title={langFile[webLang].DELETE_WORKFLOW_ALERT_TITLE}
          desc={langFile[webLang].DELETE_WORKFLOW_ALERT_DESC}
          iconType="remove"
          handleMainClick={deleteDiagnosis}
        />
      </DeleteModalPortal>

      <DeleteVideoModalPortal>
        <ConfirmAlertBox
          handleClose={closeDeleteVideoModal}
          title={langFile[webLang].VIDEO_MODAL_DELETE_VIDEO_ALERT_TITLE}
          desc={langFile[webLang].VIDEO_MODAL_DELETE_VIDEO_ALERT_DESC}
          iconType="remove"
          handleMainClick={deleteVideoHandler}
        />
      </DeleteVideoModalPortal>

      <VideoDeleteAlertModalPortal>
        <CheckAlertbox
          handleClose={closeVideoDeleteAlertModal}
          title={langFile[webLang].VIDEO_MODAL_DELETE_VIDEO_ALERT_TITLE}
          desc={langFile[webLang].VIDEO_MODAL_DELETE_VIDEO_ALERT_DESC}
        />
      </VideoDeleteAlertModalPortal>

      <AlertModalPortal>
        <CheckAlertbox
          handleClose={closeAlertModal}
          title={langFile[webLang].CP_DELETE_WORKFLOW_ALERT_TITLE}
          desc={langFile[webLang].CP_DELETE_WORKFLOW_ALERT_DESC}
        />
      </AlertModalPortal>

      <VideoAddAlertModalPortal>
        <CheckAlertbox
          handleClose={closeVideoAddAlertModal}
          title={langFile[webLang].VIDEO_MODAL_ADD_VIDEO_ALERT_TITLE}
          desc={langFile[webLang].VIDEO_MODAL_ADD_VIDEO_ALERT_DESC}
        />
      </VideoAddAlertModalPortal>
      {isModalOpen &&
        (() => {
          const modalRoot = document.querySelector("#root-modal");
          if (modalRoot) {
            return createPortal(
              <div className="modal-container">
                <div
                  className="modal-background"
                  role="presentation"
                  onClick={() => dispatch(videoActions.closeModal())}
                />
                <VideoModal
                  item={selectedVideo}
                  closeModal={() => dispatch(videoActions.closeModal())}
                  type={selectedVideo?.v_idx === 0 ? "new" : "manage"}
                  onComplete={async () => {
                    // 비디오 목록 새로고침
                    openVideoAddAlertModal();
                    if (patientInfo) {
                      const v = await getVideosByPatient(patientInfo.p_idx);
                      if (v !== "ServerError") {
                        const newV = v.filter(
                          (item) => item.p_idx === patientInfo.p_idx
                        );
                        dispatch(videoActions.setVideos(newV));
                      }
                    }
                    dispatch(videoActions.closeModal());
                  }}
                />
              </div>,
              modalRoot
            );
          }
          return null;
        })()}

      <InfoBox
        keys={infoKeys}
        data={
          patientInfo
            ? {
                p_name: patientInfo.u_name_eng,
                p_serial_no: patientInfo.p_serial_no,
                p_birthday: patientInfo.birthday
                  ? dayjs(patientInfo.birthday).format("YYYY-MM-DD")
                  : "-",
                sex: patientInfo.sex || "-",
                height: patientInfo.tall ? patientInfo.tall : "-",
                weibht: patientInfo.weight ? patientInfo.weight : "-",
                nurse: patientInfo.nurse_idx
                  ? webLang === "ko"
                    ? patientInfo.nurse_name_kor
                    : patientInfo.nurse_name_eng
                  : "-",
                phone: patientInfo.tel ? patientInfo.tel : "-",
                address: patientInfo.address ? patientInfo.address : "-",
              }
            : {}
        }
      ></InfoBox>

      <div className="controll-table-area flex justify-between">
        <div className="flex justify-end">
          <Tab handleClick={handleTabClick} tabs={tabs} />
        </div>
        <div className="controll-table-area-wrap">
          {userInfo &&
          !userInfo.p_idx &&
          searchParams.get("tab") === "medical" ? (
            <AddButton
              text={langFile[webLang].ADD_CHART_BUTTON_TEXT}
              onClick={addChart}
            />
          ) : (
            searchParams.get("tab") === "video" && (
              <AddButton
                text={langFile[webLang].ADD_VIDEO_BUTTON_TEXT}
                onClick={addVideo}
              />
            )
          )}
        </div>
      </div>
      {searchParams.get("tab") === "medical" ? (
        <table className="w-full table">
          <TableHead tds={medicaltds} />
          <tbody>
            {diagnosis.map(
              (
                {
                  w_idx,
                  w_code,
                  nurse1_idx,
                  nurse1_name_eng,
                  nurse1_name_kor,
                  nurse2_idx,
                  nurse2_name_eng,
                  nurse2_name_kor,
                  doctor1_idx,
                  doctor1_name_eng,
                  doctor1_name_kor,
                  doctor2_idx,
                  doctor2_name_kor,
                  doctor2_name_eng,
                  registdate_utc,
                  update_registdate_utc,
                },
                index
              ) => (
                <TableRow<TableMenuOption>
                  key={`diagnosis-${w_idx}-${index}`}
                  handleClick={() => openWorkflowModalHandler(w_idx)}
                  buttonText={langFile[webLang].CHART_TABLE_BUTTON_TEXT}
                  onClickMenu={(type) => {
                    setChartIdAndOpenAlert(type, w_idx);
                  }}
                  tableRowOptionType={tableDropOptions}
                  lang={webLang}
                >
                  <td>{w_code}</td>
                  <td>
                    {nurse2_idx
                      ? webLang === "en"
                        ? nurse2_name_eng
                        : nurse2_name_kor
                      : "-"}
                  </td>
                  <td>
                    {nurse1_idx
                      ? webLang === "en"
                        ? nurse1_name_eng
                        : nurse1_name_kor
                      : "-"}
                  </td>
                  <td>
                    {doctor2_idx
                      ? webLang === "en"
                        ? doctor2_name_eng
                        : doctor2_name_kor
                      : "-"}
                  </td>
                  <td>
                    {doctor1_idx
                      ? webLang === "en"
                        ? doctor1_name_eng
                        : doctor1_name_kor
                      : "-"}
                  </td>
                  <td>
                    {update_registdate_utc
                      ? convertTimeToStr(
                          userInfo?.country,
                          new Date(
                            update_registdate_utc + " UTC"
                          ).toISOString(),
                          "."
                        )
                      : "-"}
                  </td>
                  <td>
                    {convertTimeToStr(
                      userInfo?.country,
                      new Date(registdate_utc + " UTC").toISOString(),
                      "."
                    )}
                  </td>
                </TableRow>
              )
            )}
          </tbody>
        </table>
      ) : (
        <table className="w-full table">
          <TableHead tds={videotds} />
          <tbody>
            {videos.map(
              (
                {
                  v_idx,
                  v_sep,
                  di_hospital,
                  di_doctor,
                  di_memo,
                  di_date,
                  registdate_utc,
                },
                index
              ) => {
                return (
                  <TableRow<TableMenuOption>
                    key={`video-${v_idx}-${index}`}
                    handleClick={() => {
                      const currentVideo = videos.find(
                        (v) => v.v_idx === v_idx
                      );
                      if (currentVideo) {
                        dispatch(
                          videoActions.openModal({
                            video: currentVideo,
                            type: "manage",
                          })
                        );
                      }
                    }}
                    buttonText={langFile[webLang].CHART_VIDEO_BUTTON_TEXT}
                    onClickMenu={(type) => {
                      if (type === "remove") {
                        setVideoIdAndOpenAlert(v_idx);
                      }
                    }}
                    tableRowOptionType={videoTableDropOptions}
                    lang={webLang}
                  >
                    <td>{videos.length - index}</td>
                    <td>{v_sep || "-"}</td>
                    <td>{di_hospital || "-"}</td>
                    <td>{di_doctor || "-"}</td>
                    <td>{di_memo || "-"}</td>
                    <td>
                      {di_date ? dayjs(di_date).format("YYYY-MM-DD") : "-"}
                    </td>
                    <td>
                      {registdate_utc
                        ? dayjs(registdate_utc).format("YYYY-MM-DD")
                        : "-"}
                    </td>
                  </TableRow>
                );
              }
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

DiagnosisPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function getTableMedicalHeadData(lang: LangType) {
  const medicaltds: TableHeadCol[] = [
    {
      key: langFile[lang].CHART_NUMBER_TEXT,
      valueType: "id",
      type: "text",
    },
    {
      icon: <FlagKoreaSq />,
      key: langFile[lang].CHART_NURSE_TEXT,
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].CHART_NURSE_TEXT,
      valueType: "localName",
      type: "text",
    },
    {
      icon: <FlagKoreaSq />,
      key: langFile[lang].CHART_DOCTOR_TEXT,
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].CHART_DOCTOR_TEXT,
      valueType: "localName",
      type: "text",
    },

    {
      key: langFile[lang].CHART_RECENT_UPDATE_TEXT,
      valueType: "date",
      type: "text",
    },
    {
      key: langFile[lang].CHART_REGISTER_DATE_TEXT,
      valueType: "date",
      type: "text",
    },
    {
      key: "",
      type: "button",
    },
    {
      key: "",
      type: "menu",
    },
  ];

  return medicaltds;
}

function getTableVideoHeadData(lang: LangType) {
  const videotds: TableHeadCol[] = [
    {
      key: langFile[lang].VIDEO_NUM_TEXT,
      valueType: "id",
      type: "text",
    },
    {
      key: langFile[lang].VIDEO_SEP_TEXT,
      valueType: "sep",
      type: "text",
    },
    {
      key: langFile[lang].VIDEO_HOS_NAME_TEXT,
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].VIDEO_DOCTOR_TEXT,
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].VIDEO_MEMO_TEXT,
      valueType: "title",
      type: "text",
    },
    {
      key: langFile[lang].VIDEO_SHOOTING_DATE_TEXT,
      valueType: "date",
      type: "text",
    },
    {
      key: langFile[lang].VIDEO_CREATED_DATE_TEXT,
      valueType: "date",
      type: "text",
    },
    {
      key: "",
      type: "button",
    },
    {
      key: "",
      type: "menu",
    },
  ];

  return videotds;
}

function getInfoBoxHeadData(lang: LangType) {
  const INFO_KEYS: InfoBoxType[] = [
    {
      iconType: "patient",
      title: langFile[lang].PATIENT_SEARCH_PT_NAME_TEXT,
    },
    {
      iconType: "serial_no",
      title: langFile[lang].PATIENT_SERIAL_NO_TEXT,
    },
    {
      iconType: "calendar",
      title: langFile[lang].WORKFLOW_MODAL_PT_BIRTH,
    },
    {
      iconType: "gender",
      title: langFile[lang].PATIENT_MODAL_SEX_TEXT,
    },
    {
      iconType: "height",
      title: langFile[lang].CHART_INFO_BOX_PT_HEIGHT,
    },
    {
      iconType: "weight",
      title: langFile[lang].CHART_INFO_BOX_PT_WEIGHT,
    },
    {
      iconType: "nurse",
      title: langFile[lang].CHART_INFO_BOX_PT_NURSE_IN_CHARGE,
    },
    {
      iconType: "phone",
      title: langFile[lang].PATIENT_TEL_TEXT,
    },
    {
      iconType: "address",
      title: langFile[lang].PATIENT_ADDRESS_TEXT,
    },
  ];

  return INFO_KEYS;
}
