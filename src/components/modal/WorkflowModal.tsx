import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ModalFrame from "./ModalFrame";
import Send from "../common/icons/Send";
import Clip from "../common/icons/Clip";
import { useAppDispatch, useAppSelector } from "@/store";
import { shallowEqual } from "react-redux";
import {
  Gubun,
  WorkflowTabType,
  workflowModalActions,
} from "@/store/modules/workflowModalSlice";
import SelectInput from "../common/inputs/SelectInput";
import DropFileInput from "../common/inputs/DropFileInput";
import useAlertModal from "@/hooks/useAlertModal";
import ConfirmAlertBox from "../common/ConfirmAlertBox";
import CheckAlertbox from "../common/CheckAlertBox";
import DateInput, { Value } from "../common/inputs/DateInput";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import TableHead from "../common/table/TableHead";
import TableRow from "../common/table/TableRow";
import useModal from "@/hooks/useModal";
import Download from "../common/icons/Download";
import Plus from "../common/icons/Plus";
import Check from "../common/icons/Check";
import Document from "../common/icons/Document";
import { TeleconsultingModalContext } from "@/context/TeleconsultingContext";
import langFile from "@/lang";
import getTableRowMenuOptions from "@/utils/table";
import FlagKoreaSq from "../common/icons/FlagKoreaSq";
import FlagMongolSq from "../common/icons/FlagMongolSq";
import FlagKoreaRd from "@/components/common/icons/FlagKoreaRd";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ko";
import { convertChatTime, convertTimeToStr } from "@/utils/date";
import CopyLink from "../common/icons/CopyLInk";
import { getPatient } from "@/data/patient";
import {
  deletePostPrescription,
  editPostPrescription,
  editWorkflow,
  getPostPrescription,
  getPostPrescriptions,
  getWorkflow,
  registPostPrescription,
} from "../../data/workflow";
import { getOrg } from "@/data/org";
import getFiles, { deleteFile, uploadFiles } from "@/data/file";
import { MeetingInfo } from "@/pages/meeting/[id]";
import registAlert, { getAlertList } from "@/data/alert";
import { Alert, ChatAlert } from "@/types/alert";
import AlertIcon from "../common/AlertIcon";
import { getSystemAlertText } from "@/utils/alert";
import { disconnectSocket, emitEvent, onEvent } from "@/utils/socket";
import { OpinionView, PatientView } from "./WorkflowModalTabs/PatientView";
import { PreliminaryView } from "./WorkflowModalTabs/PreliminaryView";
import {
  editPreliminary,
  getPreliminariesByPIdx,
  getPreliminaryByPIdx,
  getPreliminaryByWIdx,
} from "@/data/preliminary";
import lang from "@/lang";

dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  closeModal: () => void;
};

type FilesInfo = {
  [key: string]: {
    [key: string]: SavedFile[];
  };
};

export default function WorkflowModal({ closeModal }: Props) {
  const prevChartInfo = useRef<null | DiagnosisModal>(null);
  const { userInfo } = useAppSelector(({ user }) => user);
  const { webLang } = useContext(LanguageContext);
  const tds = getTableHeadData(webLang);
  const [tableMenuOptions, setTableMenuOptions] = useState(() =>
    getTableRowMenuOptions("remove", webLang)
  );
  const [preliminaryTab, setPreliminaryTab] = useState<number>(0);
  const [preliminaryTabs, setPreliminaryTabs] = useState<string[]>([]);
  const tabs = getTabs(webLang);
  const selectedId = useRef<string>();
  const [loading, setLoading] = useState(false);
  const { openModal: openTeleModal, closeModal: closeTeleModal } = useContext(
    TeleconsultingModalContext
  );
  const [preliminaryInfo, setPreliminaryInfo] = useState<Preliminary[]>([]);
  const isPreliminary = useRef(false);
  const {
    ModalPortal,
    closeModal: closePrescriptionModal,
    openModal: openPrescriptionModal,
    modalOpened: prescriptionModalOpened,
  } = useModal();
  const { tabType, chartId, type, patientId } = useAppSelector(
    ({ workflowModal }) => ({
      tabType: workflowModal.tabType,
      chartId: workflowModal.chartId,
      type: workflowModal.modalStateType,
      patientId: workflowModal.patientId,
    }),
    shallowEqual
  );

  // 디버깅 로그 추가
  console.log("WorkflowModal 렌더링 - Redux 상태:", {
    tabType,
    chartId,
    type,
    patientId,
  });

  // preliminary 디버깅 로그
  console.log("Preliminary 상태:", {
    isPreliminary: isPreliminary.current,
    preliminaryInfo: preliminaryInfo,
    preliminaryTabs: preliminaryTabs,
    preliminaryTab: preliminaryTab,
    tabType: tabType,
  });

  const dispatch = useAppDispatch();

  const [patientInfo, setPatientInfo] = useState<Patient>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [patientOrg, setPatientOrg] = useState<Organization | null>(null);
  const [alertList, setAlertList] = useState<Alert[] | null>(null);
  const [chartInfo, setChartInfo] = useState<DiagnosisModal>({
    w_idx: 0,
    o_idx: null,

    w_code: null,
    p_idx: patientId || 0,
    pa_symptoms: null,
    pa_diagnosis: null,
    pa_care_sofar: null,
    pa_care_korea: null,

    nurse1_idx: null,
    nurse2_idx: null,
    doctor1_idx: null,
    doctor2_idx: null,

    nurse1_name_kor: null,
    nurse1_name_eng: null,
    nurse2_name_kor: null,
    nurse2_name_eng: null,
    doctor1_name_kor: null,
    doctor1_name_eng: null,
    doctor2_name_kor: null,
    doctor2_name_eng: null,

    pa_medical_history11: null,
    pa_medical_history12: null,
    pa_medical_history13: null,
    pa_medical_history14: null,
    pa_medical_history15: null,
    pa_medical_history16: null,
    pa_medical_history21: null,
    pa_medical_history22: null,
    pa_medical_history23: null,
    pa_medical_history24: null,
    pa_medical_history25: null,
    pa_medical_history26: null,
    pa_surgical_history: null,
    pa_medicine_history: null,
    pa_allergy: null,

    op_contents: null,

    te_date: null,
    te_link: null,

    ca_patient_status_summary: null,
    ca_doctor_idx: null,
    ca_doctor_name_eng: null,
    ca_doctor_name_kor: null,
    ca_department: null,
    ca_diagnosis: null,
    ca_plan: null,
    ca_period_cost: null,
    ca_caution: null,
    ca_cost_detail: null,

    vif_ho: null,
    vif_pr: null,
    vif_ve: null,
    vif_with: null,
    vif_other: null,

    vii_tad: null,
    vii_cost: null,
    vii_precaution: null,
    vii_other: null,
    vii_vi_yn: null,
    vii_vi_memo: null,

    vir_other: null,

    poc_current_status: null,
    poc_progression: null,
    poc_needed: null,

    vif_health_screening_11: null,
    vif_health_screening_12: null,
    vif_health_screening_13: null,
    vif_health_screening_14: null,
    vif_health_screening_15: null,
    vif_health_screening_16: null,
    vif_health_screening_17: null,

    vif_health_screening_21: null,
    vif_health_screening_22: null,
    vif_health_screening_23: null,
    vif_health_screening_24: null,
    vif_health_screening_25: null,
    vif_health_screening_26: null,
    vif_health_screening_27: null,
    vif_health_screening_28: null,
    vif_health_screening_29: null,
    vif_health_screening_30: null,
    vif_health_screening_31: null,
    vif_health_screening_32: null,
    vif_health_screening_33: null,
    vif_health_screening_34: null,
    vif_health_screening_35: null,
    vif_health_screening_36: null,
    vif_health_screening_37: null,
  });

  const [prescriptions, setPrescriptions] = useState<PostPrescription[]>([]);

  const [modalType, setModalType] = useState<ModalType>("download");
  const [prescriptionModalType, setPrescriptionModalType] = useState<
    "new" | "manage"
  >("new");

  const { AlertModalPortal, openAlertModal, closeAlertModal } = useAlertModal();
  const {
    AlertModalPortal: SaveAlertModalPortal,
    openAlertModal: openSaveAlertModal,
    closeAlertModal: closeSaveAlertModal,
  } = useAlertModal();
  const {
    ModalPortal: ConfirmModalPortal,
    openModal: openConfirmModal,
    closeModal: closeConfirmModal,
  } = useModal();

  const [filesData, setFilesData] = useState<FilesInfo>({
    환자정보: {
      첨부: [],
    },
    소견서정보: {
      첨부: [],
    },
    치료계획서: {
      첨부: [], //
    },
    내원준비: {
      예약확인증: [],
      초청장: [],
      여권: [],
      신원확인서: [],
      재직증명서: [],
    },
    내원상담: {
      검사항목및예약일: [], //
      주의사항: [], //
      차량정보: [],
      숙소정보: [],
      병원위치: [],
      비상연락망: [], //
    },
    내원결과: {
      처방전: [],
      개인정보동의서: [],
      검사동의서: [],
      시술동의서: [],
      입원동의서: [],
    },
    사후상담: {
      첨부: [],
    },
    사후처방: {
      약처방: [],
    },
  });

  // tab 설정
  const handleTab = (ev: MouseEvent<HTMLUListElement>) => {
    const target = ev.target as HTMLElement;
    if (!(target instanceof HTMLLIElement)) return;
    dispatch(
      workflowModalActions.setTabType(target.dataset.tab as WorkflowTabType)
    );
  };

  // 간호사, 의사 등 selectInput 값 설정
  const handleSelect = (data: User, key: string) => {
    let { u_idx, u_name_eng, u_name_kor } = data;
    let copy = { ...chartInfo };

    switch (key) {
      case "nurse1": {
        copy = {
          ...copy,
          nurse1_idx: u_idx,
          nurse1_name_kor: u_name_kor,
          nurse1_name_eng: u_name_eng,
        };
        break;
      }
      case "nurse2": {
        copy = {
          ...copy,
          nurse2_idx: u_idx,
          nurse2_name_kor: u_name_kor,
          nurse2_name_eng: u_name_eng,
        };
        break;
      }
      case "doctor1": {
        copy = {
          ...copy,
          doctor1_idx: u_idx,
          doctor1_name_kor: u_name_kor,
          doctor1_name_eng: u_name_eng,
        };
        break;
      }
      case "doctor2": {
        copy = {
          ...copy,
          doctor2_idx: u_idx,
          doctor2_name_kor: u_name_kor,
          doctor2_name_eng: u_name_eng,
        };
        break;
      }
      case "ca_doctor": {
        copy = {
          ...copy,
          ca_doctor_idx: u_idx,
          ca_doctor_name_kor: u_name_kor,
          ca_doctor_name_eng: u_name_eng,
        };
        break;
      }
    }

    setChartInfo(copy);
  };

  // tabType 에 따른 파일 요청 구분 key 반환
  const getFileGubun = (tabType: WorkflowTabType) => {
    let gubun1: Gubun1;
    switch (tabType) {
      case "patient": {
        gubun1 = "환자정보";
        break;
      }
      case "opinion": {
        gubun1 = "소견서정보";
        break;
      }
      case "carePlans": {
        gubun1 = "치료계획서";
        break;
      }
      case "visitForm": {
        gubun1 = "내원준비";
        break;
      }
      case "visitInfo": {
        gubun1 = "내원상담";
        break;
      }
      case "visitResult": {
        gubun1 = "내원결과";
        break;
      }
      case "postConsulting": {
        gubun1 = "사후상담";
        break;
      }
      case "postPrescript": {
        gubun1 = "사후처방";
        break;
      }
    }

    return gubun1;
  };

  // 파일 설정
  const handleSetFiles = async (files: File[], gubun2: Gubun2) => {
    let gubun1 = getFileGubun(tabType);
    const formData = new FormData();
    files.forEach((f) => {
      formData.append("files", f);
    });
    const res = await uploadFiles(
      formData,
      patientInfo.o_idx,
      userInfo.u_idx,
      gubun1,
      gubun2,
      chartId
    );

    if (res === "SUCCESS") {
      console.log("파일 업로드 성공 > ", gubun1, gubun2);
      const files = await getFiles(patientInfo.o_idx, gubun1, gubun2, chartId);
      if (files !== "ServerError") {
        console.log("업로드 후 파일 목록 불러오기 성공");
        setFilesData((prev) => ({
          ...prev,
          [gubun1]: { ...prev[gubun1], [gubun2]: files },
        }));
      }
    } else {
      console.log("파일 업로드 실패");
    }
  };

  // 파일 삭제
  const onRemove = async (id: string, type: string) => {
    const res = await deleteFile(parseInt(id));
    if (res === "SUCCESS") {
      const gubun1 = getFileGubun(tabType);
      setFilesData((prev) => ({
        ...prev,
        [gubun1]: {
          ...prev[gubun1],
          [type]: prev[gubun1][type].filter(
            (file) => file.f_idx !== parseInt(id)
          ),
        },
      }));
    }
  };

  const getDownloadBody = (type: WorkflowTabType) => {
    let { u_name_eng, sex, birthday, tall, weight } = patientInfo;
    let body: any = {
      lang: webLang,
      info: {},
    };
    if (type === "patient") {
      let {
        nurse1_name_eng,
        nurse1_name_kor,
        nurse2_name_eng,
        nurse2_name_kor,
        doctor1_name_eng,
        doctor1_name_kor,
        doctor2_name_kor,
        doctor2_name_eng,
        pa_symptoms,
        pa_diagnosis,
        pa_care_sofar,
        pa_care_korea,
        pa_surgical_history,
        pa_medicine_history,
        pa_allergy,
      } = chartInfo;

      let keys = [
        langFile[webLang].WORKFLOW_MODAL_PT_HTN,
        langFile[webLang].WORKFLOW_MODAL_PT_DM,
        langFile[webLang].WORKFLOW_MODAL_PT_TB,
        langFile[webLang].WORKFLOW_MODAL_PT_CANCER,
        langFile[webLang].WORKFLOW_MODAL_PT_ECT,
      ];

      for (let i = 0; i < 2; i++) {
        let count = 11 * (i + 1);
        let arr: any = [];
        for (let k = 0; k < 5; k++) {
          arr.push({
            value: chartInfo[`pa_medical_history${count}`],
            key: keys[k],
          });
          count += 1;
        }
        console.log("arr > ", arr);
        arr = arr.filter((i) => i.value === "y");
        arr = arr.map((i) => i.key);
        if (arr.includes(langFile[webLang].WORKFLOW_MODAL_PT_ECT)) {
          arr.push(chartInfo[`pa_medical_history${count}`]);
        }
        if (i === 0) body.info.familyHistory = arr;
        else body.info.pastHistory = arr;
      }

      const p = {
        name: u_name_eng,
        gender: sex,
        height: tall,
        age: new Date().getFullYear() - new Date(birthday).getFullYear(),
        birth: birthday,
        weight,
        doctorKor: webLang === "ko" ? doctor2_name_kor : doctor2_name_eng,
        doctorMn: webLang === "ko" ? doctor1_name_kor : doctor1_name_eng,
        nurseKor: webLang === "ko" ? nurse2_name_kor : nurse2_name_eng,
        nurseMn: webLang === "ko" ? nurse1_name_kor : nurse1_name_eng,
        pa_diagnosis,
        pa_symptoms,
        pa_care_sofar,
        pa_care_korea,
        pa_surgical_history,
        pa_medicine_history,
        pa_allergy,
      };

      body.info = { ...body.info, ...p };
    } else {
      let {
        ca_patient_status_summary,
        ca_doctor_name_eng,
        ca_doctor_name_kor,
        ca_department,
        ca_diagnosis,
        ca_plan,
        ca_period_cost,
        ca_caution,
        ca_cost_detail,
      } = chartInfo;
      body.info = {
        name: u_name_eng,
        birth: birthday || "",
        gender: sex,
        country: langFile[webLang].COUNTRY_MONGOLIA,
        ca_patient_status_summary,
        ca_doctor_name:
          webLang === "ko" ? ca_doctor_name_kor : ca_doctor_name_eng,
        ca_department,
        ca_diagnosis,
        ca_plan,
        ca_period_cost,
        ca_caution,
        ca_cost_detail,
      };
    }

    console.log("body : ", body);
    return body;
  };

  const downloadPdf = async (type: WorkflowTabType) => {
    const body = getDownloadBody(type);

    const response = await fetch(`/api/download/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        type: type === "patient" ? "patient" : "carePlan",
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      console.log("url > ", url);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${patientInfo.u_name_eng}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return "SUCCESS";
    } else {
      const data = await response.json();
      console.log("data > ", data);
      return "FAIL";
    }
  };

  const handleRegistAlert = async (
    type: ModalType,
    statusType?: "regist" | "complete" | "save"
  ) => {
    const tab = tabType;
    let status: "regist" | "complete" | "save" = statusType
      ? statusType
      : "regist";

    let gubun: Gubun;
    switch (tab) {
      case "patient":
        gubun = "pa";
        break;
      case "opinion":
        gubun = "op";
        break;
      case "teleconsulting":
        gubun = "te";
        break;
      case "carePlans":
        gubun = "ca";
        break;
      case "visitForm":
        gubun = "vif";
        break;
      case "visitInfo":
        gubun = "vii";
        break;

      case "visitResult":
        gubun = "vir";
        break;

      case "postConsulting":
        gubun = "poc";
        break;

      case "postPrescript": {
        gubun = "pp";
        if (type === "completed") {
          status = "complete";
        }
      }
    }

    const res = await registAlert(chartId, gubun, status);
    return res;
  };

  const fetchAlertList = async () => {
    const res = await getAlertList(chartId, "status");
    if (res !== "ServerError") {
      const filtered = res.filter(
        (i) =>
          !(i.status === "complete" && i.gubun === "vir") &&
          !(i.status === "complete" && i.gubun === "te") &&
          !(i.status === "save" && i.gubun === "update")
      );
      setAlertList(filtered);
      console.log("상태 목록", res);
    }
  };

  // confirmAlertModal 에서 확인 버튼을 클릭했을 때 실행됨
  const handleConfirmButton = async () => {
    let pass = true;

    if (modalType === "confirm") {
      const res = await handleRegistAlert(modalType);
      if (res === "SUCCESS") {
        if (tabType === "visitResult") {
          const isCompleted = alertList.find(
            (i) => i.gubun === "vir" && i.status === "complete"
          );
          console.log("isCompleted > ", isCompleted);
          if (!isCompleted) {
            const res = await handleRegistAlert(modalType, "complete");
          }
        }
        // 알람 요청 성공시, 알람 목록 재설정
        fetchAlertList();
      } else {
        console.log("실패...");
        pass = false;
      }
    } //
    else if (modalType === "download") {
      const res = await downloadPdf(tabType);
      if (res === "FAIL") {
        pass = false;
      }
    } //
    else if (modalType === "remove") {
      // 처방 요청 목록 삭제
      const res = await deletePp(parseInt(selectedId.current));
      if (res === "FAIL") {
        pass = false;
      }
    }

    if (pass) {
      closeConfirmModal();
      openAlertModal();
    }
  };

  // modal 상위의 확인요청 등의 버튼을 클릭한 경우, 모달 타입 설정 후 열기
  const handleTopBtnClick = (type: ModalType) => {
    setModalType(type);
    if (!prescriptionModalOpened) {
      openConfirmModal();
    }
  };

  // 처방요청 등록, 수정 모달에서 action button 을 클릭한 경우, alertModal 상태를 변경
  const handleActionButtonClick = async (type: ModalType) => {
    setModalType(type);

    const res = await handleRegistAlert(type);
    if (res === "SUCCESS") {
      console.log("알람 등록 성공");
      // 알람 요청 성공시, 알람 목록 재설정
      fetchAlertList();
      closePrescriptionModal();
      openAlertModal();
    } else {
      console.log("알람 등록 실패");
    }
  };

  // 처방 요청 모달 열기
  const openPsModal = (type: "new" | "manage") => {
    setPrescriptionModalType(type);
    if (type === "new") {
      selectedId.current = "";
    }
    openPrescriptionModal();
  };

  // 처방요청 등록, 수정이 완료된 경우
  const onPrescriptComplete = async (data: PostPrescriptionModal | number) => {
    if (prescriptionModalType === "new") {
      // ✨ 처방전 등록 api 통신...
      // 성공시 처방전 정보를 리스트에 추가한다.
      if (typeof data === "number") {
        const pp = await getPostPrescription(data);
        if (pp !== "ServerError" && pp) {
          const formatted: PostPrescription = {
            ...pp,
            regist_name_kor: pp.regist_u_name_kor,
            regist_name_eng: pp.regist_u_name_eng,
          };
          setPrescriptions((prev) => [formatted, ...prev]);

          const res = await handleRegistAlert(type, "save");
          if (res === "SUCCESS") {
            console.log("알람 등록 성공");
            fetchAlertList();
          } else {
            console.log("알람 등록 실패");
          }
        } else {
          console.log("약처방 등록 성공시 해당 약처방 목록 추가 실패");
        }
      }
    } else {
      if (typeof data !== "number") {
        setModalType("manage");
        setPrescriptions((prev) =>
          prev.map((p) => (p.pp_idx === data.pp_idx ? { ...p, ...data } : p))
        );
      }
    }
    closePrescriptionModal();
    openAlertModal();
  };

  const createMeeting = async (startDate: string) => {
    console.log("createMeeting");
    let endDate = dayjs(startDate)
      .add(30, "minutes")
      .tz("Asia/Seoul")
      .toISOString();

    const body = {
      startDate,
      endDate,
      fields: ["hostRoomUrl", "viewerRoomUrl"],
    };

    const response = await fetch("/api/meeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data: MeetingInfo = await response.json();
      console.log("미팅 생성 성공! > ", data);
      return data.meetingId;
    } else {
      return null;
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    const res = await fetch(`/api/meeting/${meetingId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      console.log("미팅 삭제 성공");
      return "SUCCESS";
    } else return "FAIL";
  };

  // 워크플로우 저장
  const saveWorkflow = async (ev: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    openSaveAlertModal();
    ev.preventDefault();

    // ✨ 진료 워크플로우 저장 api 통신...
    const {
      w_code,
      p_idx,
      pa_symptoms,
      pa_diagnosis,
      pa_care_sofar,
      pa_care_korea,

      nurse1_idx,
      nurse2_idx,
      doctor1_idx,
      doctor2_idx,

      pa_medical_history11,
      pa_medical_history12,
      pa_medical_history13,
      pa_medical_history14,
      pa_medical_history15,
      pa_medical_history16,
      pa_medical_history21,
      pa_medical_history22,
      pa_medical_history23,
      pa_medical_history24,
      pa_medical_history25,
      pa_medical_history26,
      pa_surgical_history,
      pa_medicine_history,
      pa_allergy,

      op_contents,

      te_date,
      te_link,

      ca_patient_status_summary,
      ca_doctor_idx,
      ca_department,
      ca_diagnosis,
      ca_plan,
      ca_period_cost,
      ca_caution,
      ca_cost_detail,

      vif_ho,
      vif_pr,
      vif_ve,
      vif_with,
      vif_other,

      vii_tad,
      vii_cost,
      vii_precaution,
      vii_other,
      vii_vi_yn,
      vii_vi_memo,

      vir_other,

      poc_current_status,
      poc_progression,
      poc_needed,

      vif_health_screening_11,
      vif_health_screening_12,
      vif_health_screening_13,
      vif_health_screening_14,
      vif_health_screening_15,
      vif_health_screening_16,
      vif_health_screening_17,

      vif_health_screening_21,
      vif_health_screening_22,
      vif_health_screening_23,
      vif_health_screening_24,
      vif_health_screening_25,
      vif_health_screening_26,
      vif_health_screening_27,
      vif_health_screening_28,
      vif_health_screening_29,
      vif_health_screening_30,
      vif_health_screening_31,
      vif_health_screening_32,
      vif_health_screening_33,
      vif_health_screening_34,
      vif_health_screening_35,
      vif_health_screening_36,
      vif_health_screening_37,
    } = chartInfo;

    const body = {
      p_idx,
      pa_symptoms,
      pa_diagnosis,
      pa_care_sofar,
      pa_care_korea,
      pa_medical_history11,
      pa_medical_history12,
      pa_medical_history13,
      pa_medical_history14,
      pa_medical_history15,
      pa_medical_history16,
      pa_medical_history21,
      pa_medical_history22,
      pa_medical_history23,
      pa_medical_history24,
      pa_medical_history25,
      pa_medical_history26,
      pa_surgical_history,
      pa_medicine_history,
      pa_allergy,
      nurse1_idx,
      nurse2_idx,
      doctor1_idx,
      doctor2_idx,
      op_contents,
      te_date,
      te_link,
      ca_doctor_idx,
      ca_patient_status_summary,
      ca_department,
      ca_diagnosis,
      ca_plan,
      ca_period_cost,
      ca_caution,
      ca_cost_detail,
      vif_ho,
      vif_pr,
      vif_ve,
      vif_with,
      vif_other,
      vii_tad,
      vii_cost,
      vii_precaution,
      vii_other,
      vii_vi_yn,
      vii_vi_memo,
      vir_other,
      poc_current_status,
      poc_progression,
      poc_needed,
      vif_health_screening_11,
      vif_health_screening_12,
      vif_health_screening_13,
      vif_health_screening_14,
      vif_health_screening_15,
      vif_health_screening_16,
      vif_health_screening_17,
      vif_health_screening_21,
      vif_health_screening_22,
      vif_health_screening_23,
      vif_health_screening_24,
      vif_health_screening_25,
      vif_health_screening_26,
      vif_health_screening_27,
      vif_health_screening_28,
      vif_health_screening_29,
      vif_health_screening_30,
      vif_health_screening_31,
      vif_health_screening_32,
      vif_health_screening_33,
      vif_health_screening_34,
      vif_health_screening_35,
      vif_health_screening_36,
      vif_health_screening_37,
    };

    let meetingId;

    if (te_date) {
      if (te_date !== prevChartInfo.current.te_date) {
        if (te_link) {
          const prevMeetingId = te_link.slice(
            te_link.lastIndexOf("/") + 1,
            te_link.lastIndexOf("?")
          );

          if (prevMeetingId) {
            await deleteMeeting(prevMeetingId);
          }
        }

        meetingId = await createMeeting(te_date.toString());

        if (meetingId) {
          body.te_link = `${process.env.NEXT_PUBLIC_HOST_URL}/meeting/${meetingId}?w=${chartId}&p=${patientInfo.p_idx}`;
        } else {
          body.te_date = prevChartInfo.current.te_date;
        }
      }
    }

    const res = await editWorkflow(chartId, userInfo.u_idx, body);
    if (res === "SUCCESS") {
      await fetchAlertList();
      prevChartInfo.current = { ...chartInfo, te_link: body.te_link };
      setLoading(false);
      setChartInfo((prev) => ({ ...prev, te_link: body.te_link }));

      dispatch(workflowModalActions.edit());
    } else {
      console.log("워크플로우 저장 실패");
      if (meetingId) {
        const res = await fetch(`/api/meeting/${meetingId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          console.log("워크플로우 저장 실패로 인한 회의 삭제");
        } else {
          console.log("회의 삭제 실패");
        }
      }
    }
  };

  const formatCost = (number: string) => {
    // 숫자와 구분기호(,)를 제외한 모든 문자를 제거
    let cleanNumber = number.replace(/[^\d,]/g, "");

    // 구분기호(,)를 제거하고 숫자만 남김
    let numericValue = cleanNumber.replace(/,/g, "");

    // 숫자 부분에 천 단위 구분 기호를 추가
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // input 변경된 값 반영
  const handleInputChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = ev.target;
    if (ev.target.type === "checkbox") {
      setChartInfo((prev) => ({ ...prev, [name]: value === "n" ? "y" : "n" }));
    } else {
      let val = value;
      if (name === "vii_cost") {
        val = formatCost(value);
      }
      setChartInfo((prev) => ({ ...prev, [name]: val }));
    }
  };

  // 원격협진 날짜, 내원 날짜 지정

  const setSchedule = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name } = ev.target;

    if (name === "teleconsultingDate") {
      setChartInfo((prev) => ({
        ...prev,
        te_date: ev.target.value ? new Date(ev.target.value) : null,
      }));
    } else if (name === "visitDate") {
      setChartInfo((prev) => ({
        ...prev,
        vii_tad: ev.target.value ? new Date(ev.target.value) : null,
      }));
    }
  };

  const handleScheduleBlur = (ev) => {
    console.log(prevChartInfo.current.te_date !== chartInfo.te_date);
    console.log(
      "prev> ",
      prevChartInfo.current.te_date,
      "cur",
      chartInfo.te_date
    );

    if (
      !prevChartInfo.current.te_date ||
      prevChartInfo.current.te_date.toString() !==
        new Date(chartInfo.te_date).toISOString()
    ) {
      let diff = new Date().getTime() > new Date(ev.target.value).getTime();
      if (diff) {
        setChartInfo((prev) => ({
          ...prev,
          te_date: prevChartInfo.current.te_date,
        }));
        return alert(langFile[webLang].WORKFLOW_MODAL_PAST_DATE_ALERT); // 올바른 날짜와 시간을 선택해주세요.
      }
    }
  };

  // 원격협진 링크 복사
  const copyTeleLink = async () => {
    try {
      await navigator.clipboard.writeText(chartInfo.te_link);
      alert(langFile[webLang].WORKFLOW_SUCCESS_ALERT_LINK_CLIPBOARD); // 링크가 복사 되었습니다.
    } catch (err) {
      alert(langFile[webLang].WORKFLOW_FAIL_ALERT_LINK_CLIPBOARD); // 링크 복사에 실패했습니다.
    }
  };

  // 처방 요청정보 삭제
  const deletePp = async (pp_idx: number) => {
    const res = await deletePostPrescription(pp_idx);
    if (res === "SUCCESS") {
      setPrescriptions((prev) => prev.filter((p) => p.pp_idx !== pp_idx));
      return "SUCCESS";
    } else {
      console.log("처방 요청정보 목록 삭제 실패");
      return "FAIL";
    }
  };

  // 진료목록 table menu에서 option을 선택한 경우
  const handleClickTableMenu = (type: string, pp_idx: number) => {
    if (userInfo.country !== "korea" || userInfo.permission !== "admin") return;
    if (type === "remove") {
      setModalType(type);
      selectedId.current = pp_idx.toString();
      openConfirmModal();
    }
  };

  const handlePreliminaryTab = (ev: React.MouseEvent<HTMLLIElement>) => {
    const { tab } = ev.currentTarget.dataset;
    setPreliminaryTab(Number(tab));
  };

  // 환자정보 설정
  useEffect(() => {
    (async () => {
      const p = await getPatient(patientId);
      if (p !== "ServerError") {
        setPatientInfo(p);

        // patientInfo가 설정된 후에 관련 작업들 수행
        const patientOrg = await getOrg(p.o_idx || 0);
        console.log("patientOrg >", patientOrg);
        if (patientOrg !== "ServerError") {
          setPatientOrg(patientOrg);
        } else {
          console.log("환자 기관정보 불러오기 실패");
        }
        const preliminary = await getPreliminariesByPIdx(patientId);
        console.log("getPreliminaryByPIdx >", preliminary);
        if (preliminary !== "ServerError" && preliminary) {
          setPreliminaryInfo(preliminary);
          const tabIds = preliminary.map((item) => {
            console.log("preliminaryItem >", item);
            return item.registdate_utc.toString();
          });
          setPreliminaryTabs(tabIds);
          console.log("preliminary 탭 설정됨:", tabIds);
          // 가장 최신 데이터(첫 번째 탭)를 기본 선택값으로 설정
          setPreliminaryTab(preliminary.length - 1);
          isPreliminary.current = true;
        } else {
          console.log("preliminary 데이터 없음");
          isPreliminary.current = false;
        }
      } else {
        console.log("환자정보 불러오기 실패 / 500");
      }
      if (userInfo && userInfo.country !== "korea") {
        const org = await getOrg(userInfo.o_idx);
        if (org !== "ServerError") {
          setOrg(org);
        } else {
          console.log("기관정보 불러오기 실패");
        }
      }

      const pp = await getPostPrescriptions(chartId);
      if (pp !== "ServerError") {
        setPrescriptions(pp);
      } else {
        console.log("처방 요청정보 목록 불러오기 실패");
      }
    })();
  }, []);

  // 진료정보 불러오기
  useEffect(() => {
    if (type === "manage") {
      (async () => {
        const res = await getWorkflow(chartId);
        if (res && res !== "ServerError") {
          setChartInfo(res);
          prevChartInfo.current = res;
        } else {
          console.log("진료 정보 불러오기 실패");
        }
      })();
    } else if (type === "new" && !prevChartInfo.current) {
      prevChartInfo.current = chartInfo;
    }
  }, [type]);

  // 언어, 사용자 권한에 따른 처방 요청정보 삭제 권한 제한
  useEffect(() => {
    let m = getTableRowMenuOptions("remove", webLang);
    m = m.map((i) =>
      userInfo.country === "korea" && userInfo.permission === "admin"
        ? { ...i, allowed: true }
        : { ...i, allowed: false }
    );
    setTableMenuOptions(m);
  }, [webLang]);

  // 알림 목록 불러오기
  useEffect(() => {
    if (patientInfo && patientInfo.p_idx) {
      fetchAlertList();
    }
  }, [patientInfo]);

  // 초기 파일목록 설정
  useEffect(() => {
    if (!patientInfo) return;

    const fetchData = async () => {
      let filesDataCopy = JSON.parse(JSON.stringify(filesData));
      const promises: Promise<void>[] = [];

      for (const key1 in filesData) {
        let gubun1 = key1 as Gubun1;
        for (const key2 in filesData[key1]) {
          let gubun2 = key2 as Gubun2;

          const fetchFiles = async () => {
            const files = await getFiles(
              patientInfo.o_idx,
              gubun1,
              gubun2,
              chartId
            );

            if (files !== "ServerError") {
              filesDataCopy = {
                ...filesDataCopy,
                [gubun1]: { ...filesDataCopy[gubun1], [gubun2]: files },
              };
            }
          };

          promises.push(fetchFiles());
        }
      }

      await Promise.all(promises);
      setFilesData(filesDataCopy);
    };

    fetchData();
  }, [patientInfo]);

  return (
    <div className="workflow-modal relative">
      {/* 약처방 모달 */}

      <ModalPortal>
        <div className="prescription-modal">
          <PrescriptionModal
            patient={!!(userInfo && userInfo.p_idx)}
            o_idx={patientInfo?.o_idx}
            w_idx={chartId}
            u_idx={userInfo.u_idx}
            country={userInfo.country}
            handleActionButtonClick={handleActionButtonClick}
            item={
              prescriptions?.find(
                (p) => p.pp_idx.toString() === selectedId.current
              ) || null
            }
            handleClose={closePrescriptionModal}
            handleComplete={onPrescriptComplete}
            type={prescriptionModalType}
          />
        </div>
      </ModalPortal>

      {/* ConfirmModal */}
      <ConfirmModalPortal>
        <ConfirmAlertBox
          iconType={modalType}
          handleClose={closeConfirmModal}
          title={getAlertText({ tabType, modalType, lang: webLang }).title}
          desc={getAlertText({ tabType, modalType, lang: webLang }).desc}
          handleMainClick={handleConfirmButton}
        />
      </ConfirmModalPortal>

      {/* 워크플로우 저장 완료 알림 모달 */}
      <SaveAlertModalPortal>
        {!loading ? (
          <CheckAlertbox
            handleClose={closeSaveAlertModal}
            title={langFile[webLang].SAVE_WORKFLOW_ALERT_TITLE} // 진료 워크플로우 저장 완료
            desc={langFile[webLang].SAVE_WORKFLOW_ALERT_DESC} // 수정 내용이 성공적으로 저장되었습니다.
          />
        ) : (
          <div className="spinner"></div>
        )}
      </SaveAlertModalPortal>

      <AlertModalPortal>
        <CheckAlertbox
          handleClose={closeAlertModal}
          title={
            getCheckModalText({
              tabType,
              modalType,
              lang: webLang,
              psModalType: prescriptionModalType,
            }).title
          }
          desc={
            getCheckModalText({
              tabType,
              modalType,
              lang: webLang,
              psModalType: prescriptionModalType,
            }).desc
          }
        />
      </AlertModalPortal>

      <ModalFrame
        completeBtnText={
          webLang !== "ko"
            ? langFile[webLang].MODAL_MANAGE_COMPLETE_BUTTON_TEXT
            : ""
        }
        chatting={<Chatting tab={tabType} alertList={alertList} />}
        onComplete={saveWorkflow}
        onClose={closeModal}
        title={langFile[webLang].WORKFLOW_MODAL_TITLE} // 진료 워크플로우 진행
        // width={window.innerWidth > 1024 ? "extra-large" : "small"}
        width="extra-large"
      >
        {/* tab */}
        <ul className="tabs flex gap-10 relative" onClick={handleTab}>
          {tabs.map(({ key, value }, idx) => (
            <li
              key={value + idx}
              data-tab={value}
              className={tabType === value ? "selected" : ""}
            >
              {key}
            </li>
          ))}
        </ul>
        {tabType === "patient" && (
          <PatientView
            chartInfo={chartInfo}
            patientInfo={patientInfo}
            lang={webLang}
            handleInputChange={handleInputChange}
            handleSelect={handleSelect}
            org={org}
            userInfo={userInfo}
            handleTopBtnClick={handleTopBtnClick}
            patient={!!(userInfo && userInfo.p_idx)}
            filesData={filesData}
            getFileGubun={getFileGubun}
            onRemove={onRemove}
            tabType={tabType}
            handleSetFiles={handleSetFiles}
          />
        )}
        {tabType === "preliminary" && isPreliminary.current && (
          <div className="preliminary-tab relative">
            {/* 환자 기본정보 - 고정 */}
            <div className="patient-info-container">
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_PT_INFO}
                  {/*환자 기본정보*/}
                </h3>
              </div>

              <div className="flex flex-col gap-10">
                <div className="input-row-wrap">
                  <div className="input-col-wrap">
                    <label className="label" htmlFor="u_name_eng">
                      {langFile[webLang].WORKFLOW_MODAL_PT_NAME}
                      {/* 이름 */}
                    </label>
                    <input
                      readOnly
                      autoComplete="off"
                      value={patientInfo?.u_name_eng || ""}
                      disabled={true}
                      type="text"
                      className="input input-disabled"
                      name="u_name_eng"
                      id="u_name_eng"
                    />
                  </div>

                  <div className="input-col-wrap">
                    <label className="label" htmlFor="p_age">
                      {langFile[webLang].WORKFLOW_MODAL_PT_AGE}
                      {/* 나이 */}
                    </label>
                    <input
                      readOnly
                      value={
                        patientInfo?.birthday
                          ? dayjs()
                              .subtract(
                                dayjs(patientInfo?.birthday).year(),
                                "year"
                              )
                              .year()
                              .toString()
                          : "-"
                      }
                      disabled
                      type="text"
                      className="input input-disabled"
                      name="p_age"
                      id="p_age"
                    />
                  </div>

                  <div className="input-col-wrap">
                    <label className="label" htmlFor="p_sex">
                      {langFile[webLang].WORKFLOW_MODAL_PT_GENDER}
                      {/* 성별 */}
                    </label>
                    <input
                      readOnly
                      value={patientInfo?.sex || ""}
                      disabled
                      type="text"
                      className="input input-disabled"
                      name="p_sex"
                      id="p_sex"
                    />
                  </div>
                </div>

                <div className="input-row-wrap">
                  <div className="input-col-wrap">
                    <label className="label" htmlFor="p_birthday">
                      {langFile[webLang].WORKFLOW_MODAL_PT_BIRTH}
                      {/* 생년월일 */}
                    </label>
                    <input
                      readOnly
                      value={
                        patientInfo?.birthday
                          ? dayjs(patientInfo?.birthday).format("YYYY/MM/DD")
                          : ""
                      }
                      disabled
                      type="text"
                      className="input input-disabled"
                      name="p_birthday"
                      id="p_birthday"
                    />
                  </div>

                  <div className="input-col-wrap">
                    <label className="label" htmlFor="p_tall">
                      {langFile[webLang].WORKFLOW_MODAL_PT_HEIGHT}
                      {/* 키 */}
                    </label>
                    <input
                      readOnly
                      value={patientInfo?.tall || ""}
                      disabled
                      type="text"
                      className="input input-disabled"
                      name="p_tall"
                      id="p_tall"
                    />
                  </div>

                  <div className="input-col-wrap">
                    <label className="label" htmlFor="p_weight">
                      {langFile[webLang].PATIENT_MODAL_WEIGHT_TEXT}
                      {/* 몸무게(kg) */}
                    </label>
                    <input
                      readOnly
                      value={patientInfo?.weight || ""}
                      disabled
                      type="text"
                      className="input input-disabled"
                      name="p_weight"
                      id="p_weight"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height: "20px" }}></div>
            {/* 사전문진 탭 */}
            <div className="preliminary-tabs-container">
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_PR_TITLE}
                  {/*사전 문진표*/}
                </h3>
              </div>

              <ul className="tabs flex gap-10 relative">
                {preliminaryInfo
                  .slice()
                  .reverse()
                  .map((item, reversedIdx) => {
                    const originalIdx =
                      preliminaryInfo.length - 1 - reversedIdx;
                    return (
                      <li
                        key={originalIdx}
                        data-tab={originalIdx}
                        onClick={handlePreliminaryTab}
                        className={
                          preliminaryTab === originalIdx ? "selected" : ""
                        }
                      >
                        {langFile[webLang].WORKFLOW_MODAL_PR_TAB_TITLE} (
                        {dayjs(item.registdate_utc).format("MM-DD")})
                        {/* 문진 */}
                      </li>
                    );
                  })}
              </ul>

              {/* 선택된 사전문진 내용 */}
              <div className="preliminary-content">
                <PreliminaryView
                  preliminaryInfo={preliminaryInfo[preliminaryTab]}
                  patientInfo={patientInfo}
                  lang={webLang}
                  userInfo={userInfo}
                  handleTopBtnClick={handleTopBtnClick}
                  handleInputChange={handleInputChange}
                  chartInfo={undefined}
                  view={true}
                />
              </div>
            </div>
          </div>
        )}
        {tabType === "preliminary" && !isPreliminary.current && (
          <div>불러올 수 있는 사전문진 정보가 없습니다.</div>
        )}

        {tabType === "opinion" && (
          <OpinionView
            chartInfo={chartInfo}
            lang={webLang}
            userInfo={userInfo}
            handleTopBtnClick={handleTopBtnClick}
            handleInputChange={handleInputChange}
            filesData={filesData}
            onRemove={onRemove}
            handleSetFiles={handleSetFiles}
            getFileGubun={getFileGubun}
            tabType={tabType}
          />
        )}

        {tabType === "teleconsulting" && (
          <div className="teleconsultation-tab relative">
            <div className="flex gap-5 header-buttons">
              {userInfo && userInfo.country !== "korea" && (
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => {
                    handleTopBtnClick("confirm");
                  }}
                >
                  {
                    langFile[webLang]
                      .WORKFLOW_MODAL_REQUEST_SCHEDULING_BUTTON_TEXT
                  }
                  <Send />
                  {/* Request scheduling */}
                </button>
              )}
            </div>
            <div className="patient-info-container">
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_TELE_INFO}
                  {/* 원격협진 정보 */}
                </h3>
              </div>
            </div>

            <div className="input-col-wrap">
              <div className="input-row-wrap">
                <div className="input-col-wrap flex-1">
                  <label
                    htmlFor="teleconsultingDate"
                    className="label flex gap-3 align-center"
                  >
                    <FlagKoreaRd />
                    {langFile[webLang].WORKFLOW_MODAL_TELE_DATE}
                    {/* 협진일시 */}
                  </label>
                  <input
                    disabled={userInfo.country !== "korea"}
                    value={
                      chartInfo.te_date
                        ? convertTimeToStr(
                            "korea",
                            chartInfo.te_date.toString(),
                            null,
                            "YYYY-MM-DDTHH:mm:ss"
                          )
                        : ""
                    }
                    onBlur={handleScheduleBlur}
                    onChange={setSchedule}
                    className="input"
                    type="datetime-local"
                    name="teleconsultingDate"
                    id="teleconsultingDate"
                  />
                </div>

                <div className="input-col-wrap flex-1">
                  <span className="label flex gap-3 align-center">
                    {langFile[webLang].WORKFLOW_MODAL_TELE_DATE} {"  "}
                    {/* 협진일시 */}
                    <span className="desc">
                      ({langFile[webLang].WORKFLOW_MODAL_TELE_DATE_META_INFO})
                      {/* (*한국 협진일시 등록시 자동 등록됩니다.) */}
                    </span>
                  </span>
                  {/* TODO 시간 포맷 추가 필요 */}
                  <div className="input input-disabled">
                    {chartInfo.te_date
                      ? convertTimeToStr(
                          patientOrg?.country || "korea",
                          chartInfo.te_date.toString(),
                          null,
                          "YYYY-MM-DD a hh:mm"
                        )
                      : ""}
                  </div>
                </div>
              </div>

              <div className="input-col-wrap">
                <span className="label">
                  {langFile[webLang].WORKFLOW_MODAL_TELE_LINK}
                  {/* 참여링크 */}
                </span>
                <div className="copy-link input input-disabled flex align-center justify-between">
                  <a
                    href={chartInfo.te_link + "?lang=" + webLang}
                    target="_blank"
                  >
                    {chartInfo.te_link}
                  </a>
                  <button onClick={copyTeleLink} type="button">
                    <CopyLink />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tabType === "carePlans" && (
          <div className="care-plans-tab relative">
            <div className="flex gap-10 header-buttons">
              {/* <button
                className="primary-btn"
                type="button"
                onClick={() => handleTopBtnClick('download')}
              >
                {langFile[lang].WORKFLOW_MODAL_DOWNLOAD_CP}
                // 치료계획서 다운로드
                <Download />
              </button> */}
              {userInfo && userInfo.country === "korea" && !userInfo.p_idx && (
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => handleTopBtnClick("confirm")}
                >
                  {langFile[webLang].WORKFLOW_MODAL_CONFIRM_CP}
                  <Send />
                  {/* 치료계획서 확인요청 */}
                </button>
              )}
            </div>

            {/* 환자 정보 */}
            <div className="patient-info-container">
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_TAB_PATIENT}
                  {/* 환자 정보 */}
                </h3>
              </div>

              <div className="flex flex-col gap-10">
                <div className="flex justify-between">
                  <div className="input-col-wrap">
                    <label htmlFor="p_birthday" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_PT_BIRTH}
                      {/* 생년월일 */}
                    </label>
                    <input
                      autoComplete="off"
                      value={
                        patientInfo?.birthday
                          ? dayjs(patientInfo?.birthday).format("YYYY/MM/DD")
                          : ""
                      }
                      disabled={true}
                      type="text"
                      name="p_birthday"
                      id="p_birthday"
                      className="input input-disabled"
                    />
                  </div>

                  <div className="input-col-wrap">
                    <label htmlFor="p_sex" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_PT_GENDER}
                      {/* 성별 */}
                    </label>
                    <input
                      autoComplete="off"
                      value={patientInfo?.sex || ""}
                      disabled
                      type="text"
                      name="p_sex"
                      id="p_sex"
                      className="input input-disabled"
                    />
                  </div>
                  {/* TODO 국적 추가 필요 */}
                  <div className="input-col-wrap">
                    <label htmlFor="country" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_CP_PATIENT_NATIONALITY}
                      {/* 국적 */}
                    </label>
                    <input
                      autoComplete="off"
                      value={langFile[webLang].COUNTRY_MONGOLIA} // 몽골
                      disabled
                      type="text"
                      name="country"
                      id="country"
                      className="input input-disabled"
                    />
                  </div>
                </div>

                <div className="input-col-wrap">
                  <label htmlFor="ca_patient_status_summary" className="label">
                    {langFile[webLang].WORKFLOW_MODAL_CP_PATIENT_STATUS}
                    {/* 환자상태 */}
                  </label>
                  <textarea
                    disabled={!!(userInfo && userInfo.p_idx)}
                    autoComplete="off"
                    name="ca_patient_status_summary"
                    id="ca_patient_status_summary"
                    className="textarea-m"
                    value={chartInfo.ca_patient_status_summary || ""}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 치료계획 */}
            <div className="diagnosis-info-container">
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_CP_CARE_PLANS}
                  {/* 치료 계획 */}
                </h3>
              </div>

              <div className="flex flex-col gap-10">
                <div className="input-col-wrap">
                  <div className="flex gap-22">
                    <div className="input-col-wrap">
                      <span className="label">
                        {langFile[webLang].WORKFLOW_MODAL_CP_DOCTOR_IN_CHARGE}
                        {/* 의사 */}
                      </span>
                      <SelectInput
                        o_idx={
                          userInfo
                            ? userInfo.country === "korea"
                              ? userInfo.o_idx
                              : org?.parent_o_idx || 0
                            : 0
                        }
                        valueKey="ca_doctor"
                        onSelect={handleSelect}
                        selected={
                          chartInfo.ca_doctor_idx
                            ? webLang === "ko"
                              ? chartInfo.ca_doctor_name_kor || ""
                              : chartInfo.ca_doctor_name_eng || ""
                            : ""
                        }
                        disabled={!!(userInfo && userInfo.p_idx)}
                      />
                    </div>

                    <div className="input-col-wrap">
                      <label htmlFor="ca_department" className="label">
                        {langFile[webLang].WORKFLOW_MODAL_CP_DEPARTMENT}
                        {/* 진료과 */}
                      </label>
                      <input
                        disabled={!!(userInfo && userInfo.p_idx)}
                        autoComplete="off"
                        type="text"
                        name="ca_department"
                        id="ca_department"
                        className="input"
                        value={chartInfo.ca_department || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="input-col-wrap">
                    <label htmlFor="ca_diagnosis" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_CP_DIAGNOSIS_DETAILS}
                      {/* 진단 내용 */}
                    </label>
                    <textarea
                      disabled={!!(userInfo && userInfo.p_idx)}
                      autoComplete="off"
                      className="textarea-m"
                      name="ca_diagnosis"
                      id="ca_diagnosis"
                      value={chartInfo.ca_diagnosis || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="input-col-wrap">
                    <label htmlFor="ca_plan" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_CP_PLAN}
                      {/* 치료 계획 */}
                    </label>
                    <textarea
                      disabled={!!(userInfo && userInfo.p_idx)}
                      autoComplete="off"
                      name="ca_plan"
                      id="ca_plan"
                      className="textarea-l"
                      value={chartInfo.ca_plan || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="input-col-wrap">
                    <label htmlFor="ca_period_cost" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_CP_DURATION_COST}
                      {/* 기간 및 예상비용 */}
                    </label>
                    <textarea
                      disabled={!!(userInfo && userInfo.p_idx)}
                      autoComplete="off"
                      name="ca_period_cost"
                      id="ca_period_cost"
                      className="textarea-s"
                      value={chartInfo.ca_period_cost || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="input-col-wrap">
                    <label htmlFor="ca_caution" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_CP_CAUTION}
                      {/* 주의사항 */}
                    </label>
                    <textarea
                      disabled={!!(userInfo && userInfo.p_idx)}
                      autoComplete="off"
                      name="ca_caution"
                      id="ca_caution"
                      className="textarea-m"
                      value={chartInfo.ca_caution || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="input-col-wrap">
                    <label htmlFor="ca_cost_detail" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_CP_COST_DETAIL}
                      {/* 비용내역 */}
                    </label>
                    <textarea
                      disabled={!!(userInfo && userInfo.p_idx)}
                      autoComplete="off"
                      name="ca_cost_detail"
                      id="ca_cost_detail"
                      className="textarea-m"
                      value={chartInfo.ca_cost_detail || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="input-col-wrap file-area">
                    <span className="label">
                      {langFile[webLang].ATTACHED_FILE}
                      {/* 첨부파일 */}
                    </span>
                    <DropFileInput
                      labelText
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="첨부"
                      files={filesData[getFileGubun(tabType)]["첨부"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tabType === "visitForm" && (
          <div className="visit-form-tab relative">
            <div className="flex gap-10 header-buttons">
              {userInfo && userInfo.country !== "korea" && !userInfo.p_idx && (
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => handleTopBtnClick("confirm")}
                >
                  {langFile[webLang].WORKFLOW_RQ_CONFIRMATION_OF_VI}
                  <Send />
                  {/* Request confirmation */}
                </button>
              )}
            </div>

            {/* 내원 요청 */}
            <div>
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_VF_VISIT_FORM}
                  {/* 내원 요청 */}
                </h3>
              </div>

              {/* 입원여부 */}
              <div className="flex flex-col gap-10">
                <div className="input-col-wrap">
                  <div className="input-row-wrap">
                    <div className="input-col-wrap">
                      <div className="label">
                        {
                          langFile[webLang]
                            .WORKFLOW_MODAL_VF_HOSPITALIZATION_OR_NOT
                        }
                        {/* 입원여부 */}
                      </div>
                      <div className="radio-box flex gap-10">
                        <span>
                          <input
                            disabled={!!(userInfo && userInfo.p_idx)}
                            type="radio"
                            name="vif_ho"
                            id="hospitalization"
                            value="y"
                            onChange={handleInputChange}
                            checked={chartInfo.vif_ho === "y"}
                          />
                          <label htmlFor="hospitalization" className="label">
                            {
                              langFile[webLang]
                                .WORKFLOW_MODAL_VF_HOSPITALIZATION
                            }
                            {/* 입원 */}
                          </label>
                        </span>

                        <span>
                          <input
                            disabled={!!(userInfo && userInfo.p_idx)}
                            type="radio"
                            name="vif_ho"
                            id="outPatient"
                            value="n"
                            onChange={handleInputChange}
                            checked={chartInfo.vif_ho === "n"}
                          />
                          <label htmlFor="outPatient" className="label">
                            {langFile[webLang].WORKFLOW_MODAL_VF_OUTPATIENT}
                            {/* 외래 */}
                          </label>
                        </span>
                      </div>
                    </div>

                    {/* 선호병실 */}
                    <div className="input-col-wrap">
                      <div className="label">
                        {langFile[webLang].WORKFLOW_MODAL_VF_PREFER_ROOM}
                        {/* 선호병실 (입원시에만) */}
                      </div>
                      <div className="radio-box flex gap-10">
                        <span>
                          <input
                            disabled={!!(userInfo && userInfo.p_idx)}
                            type="radio"
                            name="vif_pr"
                            id="basic"
                            value="y"
                            onChange={handleInputChange}
                            checked={chartInfo.vif_pr === "y"}
                          />
                          <label htmlFor="basic" className="label">
                            {langFile[webLang].WORKFLOW_MODAL_VF_BASIC_ROOM}
                            {/* 일반병실 */}
                          </label>
                        </span>

                        <span>
                          <input
                            disabled={!!(userInfo && userInfo.p_idx)}
                            type="radio"
                            name="vif_pr"
                            id="primium"
                            value="n"
                            onChange={handleInputChange}
                            checked={chartInfo.vif_pr === "n"}
                          />
                          <label htmlFor="primium" className="label">
                            {langFile[webLang].WORKFLOW_MODAL_VF_PREMIUM_ROOM}
                            {/* 상등병실 */}
                          </label>
                        </span>
                      </div>
                    </div>

                    {/* 차량여부 */}
                    <div className="input-col-wrap">
                      <div className="label">
                        {langFile[webLang].WORKFLOW_MODAL_VF_VEHICLE_OR_NOT}
                        {/* 차량 여부 */}
                      </div>
                      <div className="radio-box flex gap-10">
                        <span>
                          <input
                            disabled={!!(userInfo && userInfo.p_idx)}
                            type="radio"
                            name="vif_ve"
                            id="use"
                            value="y"
                            onChange={handleInputChange}
                            checked={chartInfo.vif_ve === "y"}
                          />
                          <label htmlFor="use" className="label">
                            {langFile[webLang].WORKFLOW_MODAL_VF_REQUIRED}
                            {/* 필요 */}
                          </label>
                        </span>

                        <span>
                          <input
                            disabled={!!(userInfo && userInfo.p_idx)}
                            type="radio"
                            name="vif_ve"
                            id="noUse"
                            value="n"
                            onChange={handleInputChange}
                            checked={chartInfo.vif_ve === "n"}
                          />
                          <label htmlFor="noUse" className="label">
                            {langFile[webLang].WORKFLOW_MODAL_VF_UNNECESSARY}
                            {/* 불필요 */}
                          </label>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 동반자여부 */}
                  <div>
                    <div className="input-col-wrap">
                      <div className="label">
                        {langFile[webLang].WORKFLOW_MODAL_VF_COMPANION_OR_NOT}
                        {/* 동반자 여부 */}
                      </div>
                      <div className="radio-box flex gap-10">
                        <span>
                          <input
                            disabled={!!(userInfo && userInfo.p_idx)}
                            type="radio"
                            name="vif_with"
                            id="with"
                            value="y"
                            onChange={handleInputChange}
                            checked={chartInfo.vif_with === "y"}
                          />
                          <label htmlFor="with" className="label">
                            {langFile[webLang].WORKFLOW_MODAL_VF_YES}
                            {/* 여 */}
                          </label>
                        </span>

                        <span>
                          <input
                            disabled={!!(userInfo && userInfo.p_idx)}
                            type="radio"
                            name="vif_with"
                            id="without"
                            value="n"
                            onChange={handleInputChange}
                            checked={chartInfo.vif_with === "n"}
                          />
                          <label htmlFor="without" className="label">
                            {langFile[webLang].WORKFLOW_MODAL_VF_NO}
                            {/* 부 */}
                          </label>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="input-col-wrap">
                  <label htmlFor="vif_other" className="label">
                    {langFile[webLang].WORKFLOW_MODAL_VF_OTHER_PRECAUTIONS}
                    {/* 기타 주의사항 */}
                  </label>
                  <textarea
                    disabled={!!(userInfo && userInfo.p_idx)}
                    autoComplete="off"
                    name="vif_other"
                    id="vif_other"
                    className="textarea-m"
                    value={chartInfo.vif_other || ""}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 건강검진 신청항목 */}
            <div>
              <div className="input-col-wrap">
                <label htmlFor="diseaseHistory" className="label">
                  {langFile[webLang].WORKFLOW_MODAL_VF_HEALTH_SCREENING_PROGRAM}
                  {/* 건강검진 신청항목 (해당시에만) */}
                </label>
                <div className="input flex flex-col gap-5 check-area check-up-container">
                  <section className="flex gap-10 align-center">
                    <span className="shrink-0">
                      {langFile[webLang].WORKFLOW_MODAL_VF_HSP_PACKAGE} :
                      {/* 패키지: */}
                    </span>
                    <div className="flex gap-5 flex-1">
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_11"
                          id="vif_health_screening_11"
                          value={chartInfo.vif_health_screening_11 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_11 === "y"}
                        />
                        <label htmlFor="vif_health_screening_11">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_P_BASIC}
                          {/* 기본 종합검진 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_12"
                          id="vif_health_screening_12"
                          value={chartInfo.vif_health_screening_12 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_12 === "y"}
                        />
                        <label htmlFor="vif_health_screening_12">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_P_DIGESTIVE}
                          {/* 소화기전문검진 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_13"
                          id="vif_health_screening_13"
                          value={chartInfo.vif_health_screening_13 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_13 === "y"}
                        />
                        <label htmlFor="vif_health_screening_13">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_P_CARDIAC}
                          {/* 심혈관전문검진 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_14"
                          id="vif_health_screening_14"
                          value={chartInfo.vif_health_screening_14 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_14 === "y"}
                        />
                        <label htmlFor="vif_health_screening_14">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_P_PULMONARY}
                          {/* 폐전문검진 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_15"
                          id="vif_health_screening_15"
                          value={chartInfo.vif_health_screening_15 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_15 === "y"}
                        />
                        <label htmlFor="vif_health_screening_15">
                          {
                            langFile[webLang]
                              .WORKFLOW_MODAL_VF_HSP_P_CAREBROVASCULAR
                          }
                          {/* 뇌혈관전문검진 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_16"
                          id="vif_health_screening_16"
                          value={chartInfo.vif_health_screening_16 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_16 === "y"}
                        />
                        <label htmlFor="vif_health_screening_16">
                          {
                            langFile[webLang]
                              .WORKFLOW_MODAL_VF_HSP_P_GYNECOLOGICAL
                          }
                          {/* 부인암전문검진 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_17"
                          id="vif_health_screening_17"
                          value={chartInfo.vif_health_screening_17 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_17 === "y"}
                        />
                        <label htmlFor="vif_health_screening_17">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_P_PREMIUM}
                          {/* 프리미엄 */}
                        </label>
                      </span>
                    </div>
                  </section>

                  <section className="flex gap-10 align-center">
                    <span>
                      {langFile[webLang].WORKFLOW_MODAL_VF_HSP_ADDITIONAL} :
                      {/* 추가 */}
                    </span>
                    <div className="flex gap-5 flex-1">
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_21"
                          id="vif_health_screening_21"
                          value={chartInfo.vif_health_screening_21 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_21 === "y"}
                        />
                        <label htmlFor="vif_health_screening_21">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_CT_BR}
                          {/* CT_뇌 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_22"
                          id="vif_health_screening_22"
                          value={chartInfo.vif_health_screening_22 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_22 === "y"}
                        />
                        <label htmlFor="vif_health_screening_22">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_CT_CH}
                          {/* CT_가슴 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_23"
                          id="vif_health_screening_23"
                          value={chartInfo.vif_health_screening_23 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_23 === "y"}
                        />
                        <label htmlFor="vif_health_screening_23">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_CT_AB_PE}
                          {/* CT_복부-골반 */}
                        </label>
                      </span>

                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_24"
                          id="vif_health_screening_24"
                          value={chartInfo.vif_health_screening_24 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_24 === "y"}
                        />
                        <label htmlFor="vif_health_screening_24">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_CT_HR_CO}
                          {/* CT_심장-관상동맥 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_25"
                          id="vif_health_screening_25"
                          value={chartInfo.vif_health_screening_25 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_25 === "y"}
                        />
                        <label htmlFor="vif_health_screening_25">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_MRI_BR}
                          {/* MRI_뇌 */}
                        </label>
                      </span>

                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_26"
                          id="vif_health_screening_26"
                          value={chartInfo.vif_health_screening_26 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_26 === "y"}
                        />
                        <label htmlFor="vif_health_screening_26">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_MRI_LU}
                          {/* MRI_요추 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_27"
                          id="vif_health_screening_27"
                          value={chartInfo.vif_health_screening_27 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_27 === "y"}
                        />
                        <label htmlFor="vif_health_screening_27">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_MRI_CE}
                          {/* MRI_자궁경부 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_28"
                          id="vif_health_screening_28"
                          value={chartInfo.vif_health_screening_28 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_28 === "y"}
                        />
                        <label htmlFor="vif_health_screening_28">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_MRI_MRA_BR}
                          {/* MRI/MRA_뇌 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_29"
                          id="vif_health_screening_29"
                          value={chartInfo.vif_health_screening_29 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_29 === "y"}
                        />
                        <label htmlFor="vif_health_screening_29">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_UL_PE}
                          {/* 초음파_골반 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_30"
                          id="vif_health_screening_30"
                          value={chartInfo.vif_health_screening_30 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_30 === "y"}
                        />
                        <label htmlFor="vif_health_screening_30">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_UL_CH}
                          {/* 초음파_가슴 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_31"
                          id="vif_health_screening_31"
                          value={chartInfo.vif_health_screening_31 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_31 === "y"}
                        />
                        <label htmlFor="vif_health_screening_31">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_UL_TH}
                          {/* 초음파_갑상선 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_32"
                          id="vif_health_screening_32"
                          value={chartInfo.vif_health_screening_32 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_32 === "y"}
                        />
                        <label htmlFor="vif_health_screening_32">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_UL_CA}
                          {/* 초음파_경동맥 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_33"
                          id="vif_health_screening_33"
                          value={chartInfo.vif_health_screening_33 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_33 === "y"}
                        />
                        <label htmlFor="vif_health_screening_33">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_UL_HT}
                          {/* 초음파_심장 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_34"
                          id="vif_health_screening_34"
                          value={chartInfo.vif_health_screening_34 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_34 === "y"}
                        />
                        <label htmlFor="vif_health_screening_34">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_UL_PR}
                          {/* 초음파_전립선 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_35"
                          id="vif_health_screening_35"
                          value={chartInfo.vif_health_screening_35 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_35 === "y"}
                        />
                        <label htmlFor="vif_health_screening_35">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_PET_CT_BR}
                          {/* PET-CT_뇌 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_36"
                          id="vif_health_screening_36"
                          value={chartInfo.vif_health_screening_36 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_36 === "y"}
                        />
                        <label htmlFor="vif_health_screening_36">
                          {langFile[webLang].WORKFLOW_MODAL_VF_HSP_A_PET_CT_TR}
                          {/* PET-CT_몸통 */}
                        </label>
                      </span>
                      <span className="flex gap-5 align-center">
                        <input
                          disabled={!!(userInfo && userInfo.p_idx)}
                          type="checkbox"
                          name="vif_health_screening_37"
                          id="vif_health_screening_37"
                          value={chartInfo.vif_health_screening_37 || "n"}
                          onChange={handleInputChange}
                          checked={chartInfo.vif_health_screening_37 === "y"}
                        />
                        <label htmlFor="vif_health_screening_37">
                          {
                            langFile[webLang]
                              .WORKFLOW_MODAL_VF_HSP_A_PET_CT_BR_TR
                          }
                          {/* PET-CT_뇌몸통 */}
                        </label>
                      </span>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* visa 요청 */}
            <div className="">
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_VF_VISA_REQUEST}
                  {/* VISA 요청 (해당 시에만) */}
                </h3>
              </div>

              <div className="input-col-wrap files-row">
                <div className="input-row-wrap">
                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VF_RS_CONFIRMATION}
                      {/* 예약확인증 */}
                    </span>
                    <DropFileInput
                      short
                      labelText
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="예약확인증"
                      files={filesData[getFileGubun(tabType)]["예약확인증"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VF_INVITATION}
                      {/* 초청장 */}
                    </span>
                    <DropFileInput
                      short
                      labelText
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="초청장"
                      files={filesData[getFileGubun(tabType)]["초청장"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VF_PASSPORT}
                      {/* 여권 */}
                    </span>
                    <DropFileInput
                      short
                      labelText
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="여권"
                      files={filesData[getFileGubun(tabType)]["여권"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>
                </div>

                <div className="input-row-wrap files-row">
                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VF_IDENTIFICATION}
                      {/* 신원확인서 */}
                    </span>
                    <DropFileInput
                      short
                      labelText
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="신원확인서"
                      files={filesData[getFileGubun(tabType)]["신원확인서"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {
                        langFile[webLang]
                          .WORKFLOW_MODAL_VF_CERTIFICATE_OF_EMPLOYMENT
                      }
                      {/* 재직증명서 */}
                    </span>
                    <DropFileInput
                      short
                      labelText
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="재직증명서"
                      files={filesData[getFileGubun(tabType)]["재직증명서"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tabType === "visitInfo" && (
          <div className="visit-info-tab relative">
            <div className="flex gap-5 header-buttons">
              {userInfo && userInfo.country === "korea" && !userInfo.p_idx && (
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => handleTopBtnClick("confirm")}
                >
                  {
                    langFile[webLang]
                      .WORKFLOW_MODAL_CONFIRM_VISIT_INFO_BUTTON_TEXT
                  }
                  <Send />
                  {/* 내원정보 확인 요청 */}
                </button>
              )}
            </div>
            {/* 내원 정보 */}
            <div>
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_VI_VISIT_INFO}
                  {/* 내원 정보 */}
                </h3>
              </div>

              <div className="input-col-wrap">
                <div className="input-row-wrap">
                  <div className="input-col-wrap flex-1">
                    <label
                      htmlFor="visitDate"
                      className="label flex gap-3 align-center"
                    >
                      <FlagKoreaSq />
                      {langFile[webLang].WORKFLOW_MODAL_VI_VISIT_DATE}
                      {/* 진료예약일 */}
                    </label>
                    <input
                      disabled={userInfo.country !== "korea"}
                      value={
                        chartInfo.vii_tad
                          ? convertTimeToStr(
                              "korea",
                              chartInfo.vii_tad.toString(),
                              null,
                              "YYYY-MM-DDTHH:mm:ss"
                            )
                          : ""
                      }
                      onChange={setSchedule}
                      className="input"
                      type="datetime-local"
                      name="visitDate"
                      id="visitDate"
                    />
                  </div>

                  <div className="input-col-wrap flex-1">
                    <span className="label flex gap-3 align-center">
                      {langFile[webLang].WORKFLOW_MODAL_VI_VISIT_DATE}
                      {/* 진료예약일 */}
                      <span className="desc">
                        (
                        {
                          langFile[webLang]
                            .WORKFLOW_MODAL_VI_VISIT_DATE_MN_META_INFO
                        }
                        )
                        {/* (*한국 진료 예약일시 등록 시 자동으로 등록됩니다) */}
                      </span>
                    </span>
                    <div className="input input-disabled">
                      {chartInfo.vii_tad
                        ? convertTimeToStr(
                            patientOrg?.country || "korea",
                            chartInfo.vii_tad.toString(),
                            null,
                            "YYYY-MM-DD a hh:mm"
                          )
                        : ""}
                    </div>
                  </div>
                </div>

                <div className="input-row-wrap">
                  <div className="input-col-wrap">
                    <label className="label" htmlFor="vii_cost">
                      {langFile[webLang].WORKFLOW_MODAL_VI_VISIT_COST}
                      {/* 내원진료비 */}
                    </label>
                    <input
                      disabled={!!(userInfo && userInfo.p_idx)}
                      autoComplete="off"
                      type="text"
                      className="input"
                      name="vii_cost"
                      id="vii_cost"
                      value={chartInfo.vii_cost || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {
                        langFile[webLang]
                          .WORKFLOW_MODAL_VI_CHECKLIST_APPOINTMENT_DATE
                      }
                      {/* 검사항목 및 예약일 */}
                    </span>
                    <DropFileInput
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="검사항목및예약일"
                      files={
                        filesData[getFileGubun(tabType)]["검사항목및예약일"]
                      }
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_CP_CAUTION}
                      {/* 주의사항 */}
                    </span>
                    <DropFileInput
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="주의사항"
                      files={filesData[getFileGubun(tabType)]["주의사항"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>
                </div>

                <div className="input-col-wrap">
                  <label className="label" htmlFor="vii_precaution">
                    {langFile[webLang].WORKFLOW_MODAL_VI_OUTPATIENT_CAUTION}
                    {/* 외래시 주의사항 */}
                  </label>
                  <textarea
                    disabled={!!(userInfo && userInfo.p_idx)}
                    autoComplete="off"
                    className="textarea-m"
                    name="vii_precaution"
                    id="vii_precaution"
                    value={chartInfo.vii_precaution || ""}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="input-col-wrap">
                  <label className="label" htmlFor="vii_other">
                    {langFile[webLang].WORKFLOW_MODAL_VI_OTHER_INFORMATION}
                    {/* 기타 안내사항 */}
                  </label>
                  <textarea
                    disabled={!!(userInfo && userInfo.p_idx)}
                    autoComplete="off"
                    className="textarea-s"
                    name="vii_other"
                    id="vii_other"
                    value={chartInfo.vii_other || ""}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="input-col-wrap">
                  <span className="label">
                    {langFile[webLang].WORKFLOW_MODAL_VI_VISIT_OR_NOT_REASIONS}
                    {/* 내원여부 및 사유 */}
                  </span>
                  <div className="input flex gap-10 align-center">
                    <span className="flex align-center gap-3">
                      <input
                        disabled={!!(userInfo && userInfo.p_idx)}
                        type="radio"
                        name="vii_vi_yn"
                        id="yes"
                        value="y"
                        onChange={handleInputChange}
                        checked={chartInfo.vii_vi_yn === "y"}
                      />
                      <label htmlFor="yes" className="label">
                        {langFile[webLang].WORKFLOW_MODAL_VF_YES}
                        {/* 여 */}
                      </label>
                    </span>

                    <span className="flex align-center gap-3">
                      <input
                        disabled={!!(userInfo && userInfo.p_idx)}
                        type="radio"
                        name="vii_vi_yn"
                        id="no"
                        value="n"
                        onChange={handleInputChange}
                        checked={chartInfo.vii_vi_yn === "n"}
                      />
                      <label htmlFor="no" className="label">
                        {langFile[webLang].WORKFLOW_MODAL_VF_NO}
                        {/* 부 */}
                      </label>
                    </span>

                    <input
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="text"
                      autoComplete="off"
                      className="check-input w-full"
                      value={chartInfo.vii_vi_memo || ""}
                      onChange={handleInputChange}
                      name="vii_vi_memo"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 컨시어지 서비스 정보 */}
            <div>
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_VI_CONCIERGE_SERVICE_INFO}
                  {/* 컨시어지 서비스 정보 */}
                </h3>
              </div>

              <div className="input-col-wrap files-row">
                <div className="input-row-wrap">
                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VI_VEHICLE_INFO}
                      {/* 차량정보 */}
                    </span>
                    <DropFileInput
                      labelText
                      short
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="차량정보"
                      files={filesData[getFileGubun(tabType)]["차량정보"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VI_ACCOMODATION_INFO}
                      {/* 숙소정보 */}
                    </span>
                    <DropFileInput
                      labelText
                      short
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="숙소정보"
                      files={filesData[getFileGubun(tabType)]["숙소정보"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VI_HOSPITAL_LOCATION}
                      {/* 병원위치 */}
                    </span>
                    <DropFileInput
                      labelText
                      short
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="병원위치"
                      files={filesData[getFileGubun(tabType)]["병원위치"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>
                </div>

                <div className="input-row-wrap files-row files-area">
                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VI_EMERGENCY_CONTACT}
                      {/* 비상연락망 */}
                    </span>
                    <DropFileInput
                      labelText
                      short
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="비상연락망"
                      files={filesData[getFileGubun(tabType)]["비상연락망"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tabType === "visitResult" && (
          <div className="visit-result-tab relative">
            <div className="flex gap-5 header-buttons">
              {userInfo && userInfo.country === "korea" && !userInfo.p_idx && (
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => handleTopBtnClick("confirm")}
                >
                  {
                    langFile[webLang]
                      .WORKFLOW_MODAL_CONFIRM_VISIT_RESULT_BUTTON_TEXT
                  }
                  <Send />
                  {/* 내원결과 확인 요청 */}
                </button>
              )}
            </div>
            {/* 진료 결과 */}
            <div>
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_VR_DIAGNOSIS_RESULT}
                  {/* 진료 결과 */}
                </h3>
              </div>

              <div className="input-col-wrap">
                <div className="input-row-wrap">
                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VR_PRESCRIPTIONS}
                      {/* 처방전 */}
                    </span>
                    <DropFileInput
                      labelText
                      short
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="처방전"
                      files={filesData[getFileGubun(tabType)]["처방전"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VR_PRIVACY_AGREEMENT}
                      {/* 개인정보동의서 */}
                    </span>
                    <DropFileInput
                      labelText
                      short
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="개인정보동의서"
                      files={filesData[getFileGubun(tabType)]["개인정보동의서"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {
                        langFile[webLang]
                          .WORKFLOW_MODAL_VR_EXAMINATION_AGREEMENT
                      }
                      {/* 검사동의서 */}
                    </span>
                    <DropFileInput
                      labelText
                      short
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="검사동의서"
                      files={filesData[getFileGubun(tabType)]["검사동의서"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>
                </div>

                <div className="input-row-wrap justify-content">
                  <div className="input-col-wrap">
                    <span className="label">
                      {langFile[webLang].WORKFLOW_MODAL_VR_PROCEDURE_AGREEMENT}
                      {/* 시술동의서 */}
                    </span>
                    <DropFileInput
                      labelText
                      short
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="시술동의서"
                      files={filesData[getFileGubun(tabType)]["시술동의서"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>

                  <div className="input-col-wrap">
                    <span className="label">
                      {
                        langFile[webLang]
                          .WORKFLOW_MODAL_VR_HOSPITALIZATION_AGREEMENT
                      }
                      {/* 입원동의서 */}
                    </span>
                    <DropFileInput
                      labelText
                      short
                      disabled={!!(userInfo && userInfo.p_idx)}
                      type="입원동의서"
                      files={filesData[getFileGubun(tabType)]["입원동의서"]}
                      onRemove={onRemove}
                      setFiles={handleSetFiles}
                      dropFile={() => {}}
                    />
                  </div>
                </div>

                <div className="input-col-wrap">
                  <label className="label" htmlFor="vir_other">
                    {langFile[webLang].WORKFLOW_MODAL_VR_OTHER_NOTABLES}
                    {/* 기타 특이사항 */}
                  </label>
                  <textarea
                    disabled={!!(userInfo && userInfo.p_idx)}
                    autoComplete="off"
                    name="vir_other"
                    id="vir_other"
                    value={chartInfo.vir_other || ""}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        {tabType === "postConsulting" && (
          <div className="post-consulting-tab relative">
            <div className="flex gap-5 header-buttons">
              {userInfo && userInfo.country !== "korea" && !userInfo.p_idx && (
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => {
                    handleTopBtnClick("confirm");
                  }}
                >
                  {
                    langFile[webLang]
                      .WORKFLOW_MODAL_CONFIRM_POST_CARE_BUTTON_TEXT
                  }
                  <Send />
                  {/* 상담내용 확인 요청 */}
                </button>
              )}
            </div>

            {/* 환자 기본정보 */}
            <div className="patient-info-container">
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_PT_INFO}
                  {/* 환자 기본정보 */}
                </h3>
              </div>

              <div className="flex flex-col gap-10">
                <div className="input-row-wrap">
                  <div className="input-col-wrap">
                    <label htmlFor="p_name_eng" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_PT_NAME}
                      {/* 이름 */}
                    </label>
                    <input
                      autoComplete="off"
                      value={patientInfo?.u_name_eng || ""}
                      disabled={true}
                      type="text"
                      name="p_name_eng"
                      id="p_name_eng"
                      className="input input-disabled"
                    />
                  </div>

                  <div className="input-col-wrap">
                    <label htmlFor="p_age" className="label">
                      {langFile[webLang].WORKFLOW_MODAL_PT_AGE}
                      {/* 나이 */}
                    </label>
                    <input
                      autoComplete="off"
                      value={
                        patientInfo?.birthday
                          ? dayjs()
                              .subtract(
                                dayjs(patientInfo?.birthday).year(),
                                "year"
                              )
                              .year()
                              .toString()
                          : ""
                      }
                      disabled
                      type="text"
                      name="p_age"
                      id="p_age"
                      className="input input-disabled"
                    />
                  </div>

                  <div className="input-col-wrap">
                    <label className="label" htmlFor="p_sex">
                      {langFile[webLang].WORKFLOW_MODAL_PT_GENDER}
                      {/* 성별 */}
                    </label>
                    <input
                      autoComplete="off"
                      value={patientInfo?.sex || ""}
                      disabled
                      type="text"
                      className="input input-disabled"
                      name="p_sex"
                      id="p_sex"
                    />
                  </div>
                </div>

                <div className="input-row-wrap">
                  <div className="input-col-wrap">
                    <label className="label" htmlFor="p_birthday">
                      {langFile[webLang].WORKFLOW_MODAL_PT_BIRTH}
                      {/* 생년월일 */}
                    </label>
                    <input
                      autoComplete="off"
                      value={
                        patientInfo?.birthday
                          ? dayjs(patientInfo.birthday).format("YYYY/MM/DD")
                          : ""
                      }
                      disabled
                      type="text"
                      className="input input-disabled"
                      name="p_birthday"
                      id="p_birthday"
                    />
                  </div>

                  <div className="input-col-wrap">
                    <label className="label" htmlFor="p_tall">
                      {langFile[webLang].WORKFLOW_MODAL_PT_HEIGHT}
                      {/* 키 */}
                    </label>
                    <input
                      autoComplete="off"
                      value={patientInfo?.tall || ""}
                      disabled
                      type="text"
                      className="input input-disabled"
                      name="p_tall"
                      id="p_tall"
                    />
                  </div>

                  <div className="input-col-wrap">
                    <label className="label" htmlFor="p_weight">
                      {langFile[webLang].PATIENT_MODAL_WEIGHT_TEXT}
                      {/* 몸무게 */}
                    </label>
                    <input
                      autoComplete="off"
                      value={patientInfo?.weight || ""}
                      disabled
                      type="text"
                      className="input input-disabled"
                      name="p_weight"
                      id="p_weight"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 환자 의료정보 */}
            <div className="medical-info-container">
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_PT_MEDICAL_INFO}
                  {/* 환자 의료정보 */}
                </h3>
              </div>

              <div className="input-col-wrap">
                <div className="input-col-wrap">
                  <label htmlFor="poc_current_status" className="label">
                    {langFile[webLang].WORKFLOW_MODAL_CURRENT_PT_STATUS}
                    {/* 현재상태 */}
                  </label>
                  <textarea
                    disabled={!!(userInfo && userInfo.p_idx)}
                    autoComplete="off"
                    name="poc_current_status"
                    id="poc_current_status"
                    className="input textarea-s"
                    value={chartInfo.poc_current_status || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-col-wrap">
                  <label htmlFor="poc_progression" className="label">
                    {langFile[webLang].WORKFLOW_MODAL_PROGRESSION}
                    {/* 경과 */}
                  </label>
                  <textarea
                    disabled={!!(userInfo && userInfo.p_idx)}
                    autoComplete="off"
                    name="poc_progression"
                    id="poc_progression"
                    className="input textarea-m"
                    value={chartInfo.poc_progression || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-col-wrap">
                  <label htmlFor="poc_needed" className="label">
                    {langFile[webLang].WORKFLOW_MODAL_MEDICATIONS_NEEDED}
                    {/* 필요한 약품 */}
                  </label>
                  <textarea
                    disabled={!!(userInfo && userInfo.p_idx)}
                    autoComplete="off"
                    name="poc_needed"
                    id="poc_needed"
                    className="input textarea-s"
                    value={chartInfo.poc_needed || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-col-wrap">
                  <span className="label">
                    {langFile[webLang].ATTACHED_FILE}
                    {/* 첨부파일 */}
                  </span>
                  <DropFileInput
                    labelText
                    disabled={!!(userInfo && userInfo.p_idx)}
                    type="첨부"
                    files={filesData[getFileGubun(tabType)]["첨부"]}
                    onRemove={onRemove}
                    setFiles={handleSetFiles}
                    dropFile={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tabType === "postPrescript" && (
          <div className="post-prescript-tab relative">
            <div className="flex gap-5 header-buttons">
              {userInfo && userInfo.country === "korea" && !userInfo.p_idx && (
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => openPsModal("new")}
                >
                  {langFile[webLang].WORKFLOW_MODAL_ADD_PRESCRIPTION_RQ}
                  <Plus />
                  {/* 처방 요청 등록하기 */}
                </button>
              )}
            </div>

            {/* 처방 요청정보 */}
            <div className="patient-info-container">
              <div className="content-header">
                <h3>
                  {langFile[webLang].WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_INFO}
                  {/* 처방 요청정보 */}
                </h3>
              </div>

              <table className="w-full table">
                <TableHead tds={tds} />
                <tbody>
                  {prescriptions &&
                    prescriptions.map(
                      ({
                        pp_idx,
                        request_type,
                        request_memo,
                        status,
                        request_date,
                        regist_name_kor,
                        regist_name_eng,
                      }) => (
                        <TableRow<TableMenuOption>
                          key={pp_idx}
                          handleClick={() => {
                            openPsModal("manage");
                            selectedId.current = pp_idx.toString();
                          }}
                          buttonText={
                            langFile[webLang]
                              .WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_MANAGE_BUTTON_TEXT
                          } // 진행관리
                          onClickMenu={(type) =>
                            handleClickTableMenu(type, pp_idx)
                          }
                          lang={webLang}
                          tableRowOptionType={
                            userInfo
                              ? userInfo.p_idx
                                ? []
                                : userInfo.country === "korea"
                                ? ["remove"]
                                : []
                              : []
                          }
                        >
                          <td>{pp_idx}</td>
                          <td>
                            {request_type === "n"
                              ? langFile[webLang]
                                  .WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_TYPE1
                              : langFile[webLang]
                                  .WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_TYPE2}
                          </td>
                          <td className="body">{request_memo}</td>
                          <td>
                            {webLang === "ko"
                              ? regist_name_kor
                              : regist_name_eng}
                          </td>
                          <td>{status === "y" ? "Y" : "N"}</td>
                          <td>
                            {request_date
                              ? convertTimeToStr(
                                  userInfo?.country,
                                  request_date.toString(),
                                  "-"
                                )
                              : "-"}
                          </td>
                        </TableRow>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </ModalFrame>
    </div>
  );
}

type ChatStatusType =
  | "create"
  | "confirm"
  | "save"
  | "zoom"
  | "chatting"
  | "completed"
  | "edit";

type Chat = {
  name_kor: string | string[];
  name_eng: string | string[];
  type: ChatStatusType;
  tab: WorkflowTabType;
  registered_date: Date;
  body?: string;
};

type ChattingProps = {
  alertList: Alert[] | null;
  tab?: WorkflowTabType;
};

const Chatting = ({ tab, alertList }: ChattingProps) => {
  const { chartId } = useAppSelector(({ workflowModal }) => workflowModal);
  const { userInfo } = useAppSelector(({ user }) => user);
  const { lang } = useContext(LanguageContext) as { lang: "ko" | "en" };

  const [chattingList, setChattingList] = useState<ChatAlert[] | null>(null);

  const chattingListRef = useRef(null);
  const alertListRef = useRef(null);

  const addComment = async (comment: string) => {
    const res = await registAlert(chartId, "chat", "regist", { comment });
    if (res === "SUCCESS") {
      console.log("log 쌓기 성공 > 이제 채팅 이벤트 발신");
      emitEvent("chat message", {
        w_idx: chartId,
        registdate_utc: new Date().toISOString(),
        regist_name_kor: userInfo.u_name_kor,
        regist_name_eng: userInfo.u_name_eng,
        chat_comment: comment,
      });

      return "SUCCESS";
    }
    return "FAIL";
  };

  useEffect(() => {
    if (chattingListRef.current) {
      chattingListRef.current.scrollTo({
        top: chattingListRef.current.scrollHeight,
      });
    }
  }, [chattingList]);

  useEffect(() => {
    if (alertListRef.current) {
      alertListRef.current.scrollTo({
        top: alertListRef.current.scrollHeight,
      });
    }
  }, [alertList]);

  useEffect(() => {
    const fetchChattingList = async () => {
      const res = await getAlertList(chartId, "chat");
      if (res !== "ServerError") {
        setChattingList(res);
        console.log("채팅 목록", res);
      }
    };

    fetchChattingList();
  }, []);

  useEffect(() => {
    emitEvent("join room", chartId);
    console.log("join room");

    onEvent("chat message", (data: ChatAlert) => {
      console.log("채팅 소켓 수신 성공", data);

      setChattingList((prev) => [...prev, data]);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div className="chatting-area flex flex-col justify-between">
      <div className="list-container" ref={alertListRef}>
        {alertList &&
          alertList.map((a, idx) => (
            <div key={a.w_idx + idx}>
              {a.status === "create" && (
                <>
                  <h3 className="created-date flex align-center">
                    {lang === "en" && (
                      <span>
                        {langFile[lang].WORKFLOW_MODAL_CHATTING_CREATED}
                      </span>
                    )}
                    <Document />
                    {convertChatTime(
                      userInfo?.country,
                      a.registdate_utc,
                      lang,
                      true
                    )}
                    {lang === "ko" && (
                      <span>
                        {langFile[lang].WORKFLOW_MODAL_CHATTING_CREATED}
                      </span>
                    )}
                  </h3>
                </>
              )}
              <div className="chat flex gap-10">
                <AlertIcon type={a.status} tab={a.gubun} />
                <p>
                  <span className="text">
                    <strong>
                      {lang === "ko"
                        ? a.regist_name_kor || "-"
                        : a.regist_name_eng || "-"}
                    </strong>
                    {getSystemAlertText(lang, a.gubun, a.status)}
                  </span>
                  <span className="written-date">
                    {convertChatTime(
                      userInfo?.country,
                      a.registdate_utc,
                      lang,
                      false
                    )}
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>
      <div>
        <div className="list-container chattings" ref={chattingListRef}>
          {chattingList &&
            chattingList.map((c, idx) => (
              <div
                className="chat chatting-chat flex gap-10"
                key={c.registdate_utc + idx}
              >
                <AlertIcon type="regist" tab={c.gubun} />
                <div className="flex flex-col gap-5">
                  <span className="text">
                    <strong>
                      {lang === "ko" ? c.regist_name_kor : c.regist_name_eng}
                    </strong>
                    <span className="written-date">
                      {convertChatTime(
                        userInfo.country,
                        c.registdate_utc,
                        lang,
                        false
                      )}
                    </span>
                  </span>
                  <p className="text">{c.chat_comment}</p>
                </div>
              </div>
            ))}
        </div>

        <div className="input-area">
          <ChattingInput
            lang={lang as "ko" | "en"}
            addChat={addComment}
            tab={tab}
            userInfo={userInfo}
          />
        </div>
      </div>
    </div>
  );
};

function ChattingInput({
  addChat,
  userInfo,
  tab,
  lang,
}: {
  addChat: (comment: string) => Promise<"SUCCESS" | "FAIL">;
  userInfo: StoredUser | null;
  tab: WorkflowTabType;
  lang: "ko" | "en";
}) {
  const [text, setText] = useState("");
  const input = useRef(null);

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (text.trim().length < 1) return;
    const res = await addChat(text);

    // 성공시
    if (res === "SUCCESS") {
      setText("");
      input.current && input.current.focus();
    }
  };

  return (
    <form className="input-wrap" onSubmit={handleSubmit}>
      <input
        autoComplete="off"
        ref={input}
        type="text"
        name="chattingInput"
        id="chattingInput"
        value={text}
        onChange={(ev) => setText(ev.target.value)}
        placeholder={langFile[lang].WORKFLOW_MODAL_CHATTING_PLACEHOLDER} // 댓글입력
      />
      {/* <button className="file-btn">
        <Clip />   
      </button> */}

      <button className="send-btn" type="submit">
        <Send />
      </button>
    </form>
  );
}

const PrescriptionModal = ({
  patient = false,
  o_idx,
  u_idx,
  w_idx,
  country,
  item,
  type,
  handleComplete,
  handleClose,
  handleActionButtonClick,
}: {
  patient?: boolean;
  o_idx?: number;
  u_idx?: number;
  w_idx?: number;
  country?: string;
  item: PostPrescription | null;
  type: "new" | "manage";
  handleComplete: (data?: number | PostPrescriptionModal) => void;
  handleClose: () => void;
  handleActionButtonClick?: (type: ModalType) => void;
}) => {
  const gubun1 = "사후처방";
  const gubun2 = "약처방";

  const { lang } = useContext(LanguageContext);
  const [pInfo, setPInfo] = useState<PostPrescriptionModal>({
    pp_idx: 0,
    request_type: "n",
    request_date: new Date(),
    request_memo: "",
    status: "n",
  });

  const [files, setFiles] = useState<File[] | SavedFile[]>([]);

  const setSelectedFiles = async (files: File[]) => {
    if (type === "new") {
      setFiles(files);
    } else {
      const formData = new FormData();
      files.forEach((f) => {
        formData.append("files", f);
      });
      const res = await uploadFiles(
        formData,
        o_idx,
        u_idx,
        gubun1,
        gubun2,
        w_idx,
        pInfo.pp_idx
      );
      if (res === "SUCCESS") {
        const files = await getFiles(
          o_idx,
          gubun1,
          gubun2,
          w_idx,
          pInfo.pp_idx
        );
        if (files !== "ServerError") {
          setFiles(files);
        } else {
          console.log("파일목록 불러오기 실패");
        }
      } else {
        console.log("pp 파일 업로드 실패");
      }
    }
  };

  const onRemove = async (id: string) => {
    if (type === "new") {
      if (!("f_idx" in files[0])) {
        setFiles((prev) => (prev as File[]).filter((file) => file.name !== id));
      }
    } else {
      // 파일을 삭제하시겠습니까?
      if (confirm(langFile[lang].DELETE_FILE_CONFIRM_TEXT)) {
        const res = await deleteFile(parseInt(id));
        if (res === "SUCCESS") {
          if ("f_idx" in files[0]) {
            setFiles((prev) =>
              (prev as SavedFile[]).filter(
                (file) => file.f_idx !== parseInt(id)
              )
            );
          }
        } else {
          console.log("파일 삭제");
        }
      }
    }
  };

  // 현재 모달 내에서 확인 버튼을 클릭하여 약처방 요청 정보를 등록, 수정 하는 경우 실행
  const onComplete = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const { request_date, request_memo, request_type, status } = pInfo;
    const body = {
      request_date: dayjs(request_date).format("YYYY-MM-DD"),
      request_memo,
      request_type,
      status,
    };
    if (type === "new") {
      const res = await registPostPrescription(o_idx, w_idx, u_idx, body);
      if (res.message === "SUCCESS") {
        const formData = new FormData();
        files.forEach((f) => {
          formData.append("files", f);
        });
        const filesResponse = await uploadFiles(
          formData,
          o_idx,
          u_idx,
          gubun1,
          gubun2,
          w_idx,
          res.pp_idx
        );
        if (filesResponse === "SUCCESS") {
          handleComplete(res.pp_idx);
        } else {
          console.log("약처방 파일등록 실패");
        }
      } else {
        console.log("약처방 등록 실패");
      }
    } else {
      const res = await editPostPrescription(item.pp_idx, body);
      if (res === "SUCCESS") {
        handleComplete(pInfo);
      } else {
        console.log("처방 요청 정보 수정 실패");
      }
    }
  };

  // 처방내용 확인요청, 확인처리 버튼 클릭시 실행
  const topBtnClick = () => {
    // ✨ 처방내용 확인요청, 처방요청 완료처리 api 통신...
    // 성공시 아래의 함수 실행 ( 처방요청 목록 모달 닫고, 알림 모달 띄움 )
    if (handleActionButtonClick) {
      if (country === "korea") {
        handleActionButtonClick("confirm");
      } else {
        handleActionButtonClick("completed");
      }
    }
    // handleActionButtonClick && handleActionButtonClick();
  };

  // input, textarea 값 업데이트
  const handleChangeInput = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = ev.target;
    const { name, value } = target;
    setPInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 요청일 날짜 선택
  const handleDate = (dates: Value) => {
    if (dates && !Array.isArray(dates)) {
      setPInfo({
        ...pInfo,
        request_date: new Date(dates),
      });
    }
  };

  // 약처방 요청 정보를 props로 전달한 경우(관리하기) 전달받은 값으로 초기값을 설정
  useEffect(() => {
    if (item) {
      setPInfo(item);
    }
  }, [item]);

  // 파일 초기 세팅
  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getFiles(o_idx, gubun1, gubun2, w_idx, pInfo.pp_idx);
      if (files !== "ServerError") {
        setFiles(files);
      } else {
        console.log("파일목록 불러오기 실패");
      }
    };

    if (type === "manage" && pInfo.pp_idx) {
      fetchFiles();
    }
  }, [pInfo]);

  return (
    <ModalFrame
      onComplete={onComplete}
      onClose={handleClose}
      title={
        type === "new"
          ? langFile[lang].PRESCRIPTION_REQUEST_MODAL_NEW_TITLE // 약처방 요청 등록
          : langFile[lang].PRESCRIPTION_REQUEST_MODAL_MANAGE_TITLE // 약처방 요청 관리
      }
      completeBtnText={
        type === "new"
          ? langFile[lang].WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_ADD_BUTTON_TEXT // 완료
          : langFile[lang].MODAL_MANAGE_COMPLETE_BUTTON_TEXT // 저장
      }
      width="basic"
      hideBtns={(type === "manage" && country !== "korea") || patient}
    >
      <div className="relative">
        <div className="flex gap-5 header-buttons">
          {type === "manage" && country === "korea" && !patient && (
            <button className="primary-btn" type="button" onClick={topBtnClick}>
              {
                langFile[lang]
                  .PRESCRIPTION_REQUEST_MODAL_REQUEST_PP_CONFIRM_BUTTON_TEXT
              }
              {/* 처방내용 확인 요청 */}
              <Send />
            </button>
          )}

          {type === "manage" && country !== "korea" && !patient && (
            <button className="primary-btn" type="button" onClick={topBtnClick}>
              {
                langFile[lang]
                  .PRESCRIPTION_REQUEST_MODAL_MARK_AS_COMPLETE_BUTTON_TEXT
              }
              {/* 처방요청 완료 처리 */}
              <Check />
            </button>
          )}
        </div>

        <div className="content-header">
          <h3>
            {langFile[lang].PRESCRIPTION_REQUEST_MODAL_REQUEST_INFO}
            {/* 처방 요청정보 */}
          </h3>
        </div>

        <div className="input-col-wrap">
          <div className="input-row-wrap">
            {/* 요청 유형 radio */}
            <div className="input-col-wrap flex-1">
              <span className="label">
                {langFile[lang].PRESCRIPTION_REQUEST_MODAL_REQUEST_TYPE}
                {/* 요청유형 */}
              </span>
              <div
                className={`radio-box flex gap-10 flex-1 ${
                  type === "manage" && country !== "korea"
                    ? "input-disabled"
                    : ""
                }`}
              >
                <span className="flex align-center gap-5">
                  <label htmlFor="n" className="label">
                    {langFile[lang].WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_TYPE1}
                    {/* 추가 */}
                  </label>
                  <input
                    onChange={handleChangeInput}
                    checked={pInfo.request_type === "n"}
                    value="n"
                    type="radio"
                    name="request_type"
                    id="n"
                    disabled={
                      (type === "manage" && country !== "korea") || patient
                    }
                  />
                </span>

                <span className="flex align-center gap-5">
                  <label htmlFor="e" className="label">
                    {langFile[lang].WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_TYPE2}
                    {/* 수정 */}
                  </label>
                  <input
                    onChange={handleChangeInput}
                    value="e"
                    checked={pInfo.request_type === "e"}
                    type="radio"
                    name="request_type"
                    id="e"
                    disabled={
                      (type === "manage" && country !== "korea") || patient
                    }
                  />
                </span>
              </div>
            </div>

            {/* 요청일 */}
            <div className="flex-1 input-col-wrap">
              <span className="label">
                {langFile[lang].PRESCRIPTION_REQUEST_MODAL_REQUEST_DATE}
                {/* 요청일 */}
              </span>
              <DateInput
                value={new Date(pInfo.request_date)}
                onComplete={handleDate}
                range={false}
                disabled={(type === "manage" && country !== "korea") || patient}
              />
            </div>
          </div>

          <div className="input-col-wrap">
            <label className="label">
              {langFile[lang].PRESCRIPTION_REQUEST_MODAL_REQUEST_DETAILS}
              {/* 요청사항 */}
            </label>
            <textarea
              autoComplete="off"
              name="request_memo"
              onChange={handleChangeInput}
              value={pInfo.request_memo}
              className="input textarea-m"
              disabled={(type === "manage" && country !== "korea") || patient}
            ></textarea>
          </div>

          <div className="input-col-wrap">
            <span className="label">
              {langFile[lang].ATTACHED_FILE}
              {/* 첨부파일 */}
            </span>
            <DropFileInput
              labelText
              files={files}
              type="addedFiles"
              setFiles={setSelectedFiles}
              onRemove={onRemove}
              disabled={(type === "manage" && country !== "korea") || patient}
            />
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};

// modalType, tabType 에 따라 확인 알림 텍스트를 반환
const getAlertText = ({
  tabType,
  modalType,
  lang,
}: {
  tabType: WorkflowTabType;
  modalType: ModalType;
  lang: LangType;
}) => {
  const alertText = {
    title: "",
    desc: "",
  };
  if (tabType === "patient") {
    if (modalType === "download") {
      alertText.title = langFile[lang].DOWNLOAD_PT_INFO_ALERT_TITLE; // 환자정보를 다운로드 하시겠습니까?
      alertText.desc = langFile[lang].DOWNLOAD_PT_INFO_ALERT_DESC; // 확인버튼을 클릭하시면 다운로드가 시작됩니다.
    } //
    else if (modalType === "confirm") {
      alertText.title = langFile[lang].RQ_CONFIRM_PATIENT_INFO_ALERT_TITLE; // 환자정보 확인을 요청 하시겠습니까?
      alertText.desc = langFile[lang].RQ_CONFIRM_PATIENT_INFO_ALERT_DESC; // 확인버튼을 클릭하시면 환자정보 확인이 요청됩니다.
    }
  } //
  else if (tabType === "opinion" && modalType === "confirm") {
    alertText.title = langFile[lang].RQ_CONFIRM_OPINION_ALERT_TITLE; // 소견서 확인을 요청 하시겠습니까?
    alertText.desc = langFile[lang].RQ_CONFIRM_OPINION_ALERT_DESC; // 확인 버튼을 클릭하시면 소견서 확인이 요청됩니다.
  } //
  else if (tabType === "teleconsulting") {
    if (modalType === "confirm") {
      alertText.title = langFile[lang].RQ_CONFIRM_SCHEDULING_ALERT_TITLE; // 원격협진 스케쥴링을 요청 하시겠습니까?
      alertText.desc = langFile[lang].RQ_CONFIRM_SCHEDULING_ALERT_DESC; // 확인 버튼을 클릭하시면  원격협진 스케쥴링이 요청됩니다.
    }
  } //
  else if (tabType === "carePlans") {
    if (modalType === "confirm") {
      alertText.title = langFile[lang].RQ_CONFIRM_CP_ALERT_TITLE; // 치료계획서 확인을 요청 하시겠습니까?
      alertText.desc = langFile[lang].RQ_CONFIRM_CP_ALERT_DESC; // 확인 버튼을 클릭하시면 치료계획서 확인이 요청됩니다.
    } else if (modalType === "download") {
      alertText.title = langFile[lang].DOWNLOAD_CP_ALERT_TITLE; // 치료계획서를 다운로드 하시겠습니까?
      alertText.desc = langFile[lang].DOWNLOAD_CP_ALERT_DESC; // 확인 버튼을 클릭하시면 다운로드가 시작됩니다.
    }
  } //
  else if (tabType === "visitForm") {
    if (modalType === "confirm") {
      alertText.title = langFile[lang].RQ_CONFIRM_VF_ALERT_TITLE; // 내원준비 확인을 요청 하시겠습니까?
      alertText.desc = langFile[lang].RQ_CONFIRM_VF_ALERT_DESC; // 확인 버튼을 클릭하시면 내원준비 확인이 요청됩니다.
    }
  } //
  else if (tabType === "visitInfo" && modalType === "confirm") {
    alertText.title = langFile[lang].RQ_CONFIRM_VI_ALERT_TITLE; // '내원정보 확인을 요청 하시겠습니까?
    alertText.desc = langFile[lang].RQ_CONFIRM_VI_ALERT_DESC; // 확인 버튼을 클릭하시면 내원정보 확인이 요청됩니다.
  } //
  else if (tabType === "visitResult" && modalType === "confirm") {
    alertText.title = langFile[lang].RQ_CONFIRM_VR_ALERT_TITLE; // 내원결과 확인을 요청 하시겠습니까?
    alertText.desc = langFile[lang].RQ_CONFIRM_VR_ALERT_DESC; // 확인 버튼을 클릭하시면 내원결과 확인이 요청됩니다.
  } //
  else if (tabType === "postConsulting" && modalType === "confirm") {
    alertText.title = langFile[lang].RQ_CONFIRM_PC_ALERT_TITLE; // 상담내용 확인을 요청 하시겠습니까?
    alertText.desc = langFile[lang].RQ_CONFIRM_PC_ALERT_DESC; // 확인 버튼을 클릭하시면 상담내용 확인이 요청됩니다.
  } //
  else if (tabType === "postPrescript") {
    if (modalType === "confirm") {
      alertText.title = "처방내용 확인을 요청 하시겠습니까?";
      alertText.desc = "확인 버튼을 클릭하시면 처방내용 확인이 요청됩니다.";
    } else if (modalType === "completed") {
      alertText.title = "처방요청을 완료 처리 하시겠습니까?";
      alertText.desc = "확인 버튼을 클릭하시면 처방요청이 완료 처리됩니다.";
    } else if (modalType === "remove") {
      alertText.title = langFile[lang].DELETE_PP_REQ_ALERT_TITLE; // 처방요청을 삭제하시겠습니까?
      alertText.desc = langFile[lang].DELETE_PP_REQ_ALERT_DESC; // 삭제 버튼을 클릭하시면 처방요청이 삭제됩니다.
    }
  }

  return alertText;
};

// modalType, tabType, psModalType(약처방등록모달 타입) 에 따라 완료 알림 텍스트 반환
const getCheckModalText = ({
  tabType,
  modalType,
  psModalType,
  lang,
}: {
  tabType: WorkflowTabType;
  modalType: ModalType;
  lang: LangType;
  psModalType: "new" | "manage" | "";
}) => {
  const confirmModalText = {
    title: "",
    desc: "",
  };

  if (tabType === "patient") {
    if (modalType === "download") {
      confirmModalText.title = langFile[lang].CP_DOWNLOAD_PT_INFO_ALERT_TITLE; // 환자정보 다운로드 완료
      confirmModalText.desc = langFile[lang].CP_DOWNLOAD_PT_INFO_ALERT_DESC; // 환자정보 다운로드가 완료되었습니다.
    } //
    else if (modalType === "confirm") {
      confirmModalText.title =
        langFile[lang].CP_RQ_CONFIRM_PATIENT_INFO_ALERT_TITLE; // 환자정보 확인 요청 완료
      confirmModalText.desc =
        langFile[lang].CP_RQ_CONFIRM_PATIENT_INFO_ALERT_DESC; // 환자정보 확인 요청이 완료되었습니다.
    }
  } //
  else if (tabType === "opinion" && modalType === "confirm") {
    confirmModalText.title = langFile[lang].CP_RQ_CONFIRM_OPINION_ALERT_TITLE; // 소견서 확인 요청 완료
    confirmModalText.desc = langFile[lang].CP_RQ_CONFIRM_OPINION_ALERT_DESC; // 소견서 확인 요청이 완료되었습니다.
  } //
  else if (tabType === "teleconsulting") {
    if (modalType === "confirm") {
      confirmModalText.title =
        langFile[lang].CP_RQ_CONFIRM_SCHEDULING_ALERT_TITLE; // 원격협진 스케쥴링 요청 완료
      confirmModalText.desc =
        langFile[lang].CP_RQ_CONFIRM_SCHEDULING_ALERT_DESC; // '원격협진 스케쥴링 요청이 완료되었습니다.
    }
  } //
  else if (tabType === "carePlans") {
    if (modalType === "confirm") {
      confirmModalText.title = langFile[lang].CP_RQ_CONFIRM_CP_ALERT_TITLE; // 치료계획서 확인 요청 완료
      confirmModalText.desc = langFile[lang].CP_RQ_CONFIRM_CP_ALERT_DESC; // 치료계획서 확인 요청이 완료되었습니다.
    } else if (modalType === "download") {
      confirmModalText.title = langFile[lang].CP_DOWNLOAD_CP_ALERT_TITLE; // 치료계획서 다운로드 완료
      confirmModalText.desc = langFile[lang].CP_DOWNLOAD_CP_ALERT_DESC; // 치료계획서 다운로드가 완료되었습니다.
    }
  } //
  else if (tabType === "visitForm") {
    if (modalType === "confirm") {
      confirmModalText.title = langFile[lang].CP_RQ_CONFIRM_VF_ALERT_TITLE; // 내원준비 확인 요청 완료
      confirmModalText.desc = langFile[lang].CP_RQ_CONFIRM_VF_ALERT_DESC; // 내원준비 확인 요청이 완료되었습니다.
    }
  } //
  else if (tabType === "visitInfo" && modalType === "confirm") {
    confirmModalText.title = langFile[lang].CP_RQ_CONFIRM_VI_ALERT_TITLE; // 내원정보 확인 요청 완료
    confirmModalText.desc = langFile[lang].CP_RQ_CONFIRM_VI_ALERT_DESC; // 내원정보 확인 요청이 완료되었습니다.
  } //
  else if (tabType === "visitResult" && modalType === "confirm") {
    confirmModalText.title = langFile[lang].CP_RQ_CONFIRM_VR_ALERT_TITLE; // 내원결과 확인 요청 완료
    confirmModalText.desc = langFile[lang].CP_RQ_CONFIRM_VR_ALERT_DESC; // 내원결과 확인 요청이 완료되었습니다.
  } //
  else if (tabType === "postConsulting" && modalType === "confirm") {
    confirmModalText.title = langFile[lang].CP_RQ_CONFIRM_PC_ALERT_TITLE; // 상담내용 확인 요청 완료
    confirmModalText.desc = langFile[lang].CP_RQ_CONFIRM_PC_ALERT_DESC; // 상담내용 확인 요청이 완료되었습니다.
  } //
  else if (tabType === "postPrescript") {
    if (psModalType === "new") {
      confirmModalText.title = langFile[lang].ADD_PP_REQ_ALERT_TITLE; // 처방요청 등록 완료
      confirmModalText.desc = langFile[lang].ADD_PP_REQ_ALERT_DESC; // 처방요청 등록이 완료되었습니다.
    } else if (psModalType === "manage") {
      if (modalType === "confirm") {
        confirmModalText.title = langFile[lang].CP_RQ_CONFIRM_PP_ALERT_TITLE; // 처방내용 확인 요청 완료
        confirmModalText.desc = langFile[lang].CP_RQ_CONFIRM_PP_ALERT_DESC; // 처방내용 확인 요청이 완료되었습니다.
      } else if (modalType === "completed") {
        confirmModalText.title =
          langFile[lang].CP_COMPLETE_CONFIRM_RQ_ALERT_TITLE; // 처방요청 완료 처리 완료
        confirmModalText.desc =
          langFile[lang].CP_COMPLETE_CONFIRM_RQ_ALERT_DESC; // 처방요청 완료 처리가 완료되었습니다.
      } else if (modalType === "manage") {
        confirmModalText.title = langFile[lang].EDIT_PP_REQ_ALERT_TITLE; // 처방요청 정보 수정 완료
        confirmModalText.desc = langFile[lang].EDIT_PP_REQ_ALERT_DESC; // 처방요청 정보 수정이 완료되었습니다.
      }
    }

    if (modalType === "remove") {
      confirmModalText.title = langFile[lang].CP_DELETE_PP_REQ_ALERT_TITLE; // 처방요청 삭제 완료
      confirmModalText.desc = langFile[lang].CP_DELETE_PP_REQ_ALERT_DESC; // 처방요청 삭제가 완료되었습니다.
    }
  }

  return confirmModalText;
};

function getTableHeadData(lang: LangType) {
  const tds: TableHeadCol[] = [
    {
      key: "No",
      valueType: "id",
      type: "text",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_TYPE, // 요청유형
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_CONTENTS, // 요청사항
      valueType: "body",
      type: "text",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_WRITER, // 작성자
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_STATUS, // 처리완료여부
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_PP_PRESCRIPTION_RQ_REGISTER_DATE, // 요청일
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

  return tds;
}

function getTabs(lang: LangType) {
  const workflow_tabs: { key: string; value: WorkflowTabType }[] = [
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_PATIENT, // 환자정보
      value: "patient",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_OPINION, // 소견서정보
      value: "opinion",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_PRELIMINARY, // 사전문진
      value: "preliminary",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_TELECONSULTING, // 원격협진
      value: "teleconsulting",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_CARE_PLANS, // 치료계획서
      value: "carePlans",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_VISIT_FORM, // 내원준비
      value: "visitForm",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_VISIT_INFO, // 내원상담
      value: "visitInfo",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_VISIT_RESULT, // 내원결과
      value: "visitResult",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_POST_CARE, // 사후상담
      value: "postConsulting",
    },
    {
      key: langFile[lang].WORKFLOW_MODAL_TAB_POST_PRESCRIPTION, //  사후처방
      value: "postPrescript",
    },
  ];

  return workflow_tabs;
}
