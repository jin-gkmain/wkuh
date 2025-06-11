import Layout from "@/components/common/Layout";
import AddButton from "@/components/common/inputs/AddButton";
import Select, { SelectOptionType } from "@/components/common/inputs/Select";
import TableHead from "@/components/common/table/TableHead";
import TableRow from "@/components/common/table/TableRow";
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";
import PatientModalBox from "@/components/modal/PatientModalBox";
import useAlertModal from "@/hooks/useAlertModal";
import ConfirmAlertBox from "@/components/common/ConfirmAlertBox";
import CheckAlertbox from "@/components/common/CheckAlertBox";
import FlagMongolSq from "@/components/common/icons/FlagMongolSq";
import langFile from "@/lang";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import getTableRowMenuOptions from "@/utils/table";
import { convertTimeToStr } from "@/utils/date";
import SearchPatientsContent from "@/components/pages/organizations/SearchPatientsContent";
import { useAppSelector } from "@/store";
import getOrgs from "@/data/org";
import { getPatients, deletePatient } from "@/data/patient";
import MyHead from "@/components/common/MyHead";

export type searchOptions = {
  search_p_chart_no: string;
  search_name: string;
  search_nurse: string;
};

export default function WorkflowPage() {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { lang } = useContext(LanguageContext);
  const [tableDropOptions, setTableDropOptions] = useState<TableMenuOption[]>(
    []
  );
  const tds = getTableHeadData(lang);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [hospitals, setHospitals] = useState<Organization[]>([]);
  const [hospitalsOptions, setHospitalsOptions] = useState<SelectOptionType[]>(
    []
  );

  const { ModalPortal, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<ModalType>("new");
  const [selectedHospital, setSelectedHospital] = useState("");
  const {
    ModalPortal: RemoveModalPortal,
    openModal: openRemoveModal,
    closeModal: closeRemoveModal,
  } = useModal();
  const { AlertModalPortal, openAlertModal, closeAlertModal } = useAlertModal();

  const selectedPatientIdx = useRef(0);
  const router = useRouter();

  const [searchInputs, setSearchInputs] = useState<searchOptions>({
    search_p_chart_no: "",
    search_name: "",
    search_nurse: "",
  });

  // 병원 선택
  const setSelected = (selected: string) => {
    setSelectedHospital(selected);
  };

  // 해당 환자의 진료목록 이동
  const handleTableRowBtnClick = (id: number) => {
    router.push(`/workflow/diagnosis/${id}`);
  };

  // 환자 table 의 dropdown 메뉴 선택시 동작
  const onClickMenu = (type: string, patientNumber: number) => {
    selectedPatientIdx.current = patientNumber;
    if (type === "manage") {
      openSelectedModal("manage");
    } else if (type === "remove") {
      if (userInfo.country !== "korea" || userInfo.permission !== "admin") {
        return;
      }
      setModalType("remove");
      openRemoveModal();
    }
  };

  // 인자로 전달받은 모달 타입에 맞는 모달을 띄움
  const openSelectedModal = (type: ModalType) => {
    setModalType(type);
    openModal();
  };

  // 환자 등록, 수정이 완료되었을 때 동작
  const onComplete = async (data: Patient | null) => {
    if (modalType === "new") {
      // ✨ 전달받은 환자 data 를 patients 목록에 추가한다.
      const o_idx =
        userInfo.country === "korea"
          ? parseInt(selectedHospital)
          : userInfo.o_idx;

      const res = await getPatients(o_idx, searchInputs);
      if (res !== "ServerError") {
        setPatients(res);
      } else {
        console.log("환자목록 불러오기 실패");
      }
    } else if (modalType === "manage") {
      // ✨ 전달받은 환자 data를 patients 에서 찾아 변경된 부분을 수정한다.
      setPatients((prev) =>
        prev.map((p) => (p.p_idx === data.p_idx ? data : p))
      );
    }
    closeModal();
    openAlertModal();
  };

  // 환자목록 삭제
  const removePatient = async () => {
    const res = await deletePatient(selectedPatientIdx.current);
    if (res === "SUCCESS") {
      setPatients((prev) =>
        prev.filter((item) => item.p_idx !== selectedPatientIdx.current)
      );
      closeRemoveModal();
      openAlertModal();
    } else {
      console.log("환자 삭제 실패");
    }
  };

  // 환자목록 조회 검색어 설정
  const handleSearchComplete = useCallback((searchOptions: searchOptions) => {
    setSearchInputs(searchOptions);
  }, []);

  // 환자 등록하기 버튼 클릭시 동작
  const addPatient = () => {
    if (userInfo && userInfo.country === "korea") {
      if (!selectedHospital)
        return alert(langFile[lang].PATIENT_ALERT_ADD_ORG_FIRST); // PATIENT_ALERT_ADD_ORG_FIRST
    }
    openSelectedModal("new");
  };

  // 병원목록 설정
  useEffect(() => {
    if (!userInfo) return;

    const fetchHostpitals = async () => {
      let search = userInfo.country === "korea" ? "parent_o_idx" : "o_idx";
      let search_key = userInfo.o_idx;

      const h = await getOrgs({
        search,
        search_key,
      });

      if (h !== "ServerError") {
        setHospitals(h);
        console.log("병원목록 받기!!! > ", h);
      } else {
        console.log("병원 목록 데이터 받기 실패");
      }
    };

    if (!userInfo.p_idx) fetchHostpitals();
    else router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
  }, [userInfo]);

  // 병원목록을 기반으로 options 를 설정
  useEffect(() => {
    let options: SelectOptionType[] = [];
    hospitals.forEach((o) => {
      const option: SelectOptionType = {
        key: o.o_name_kor || "",
        keyEn: o.o_name_eng || "",
        value: o.o_idx.toString(),
      };
      if (o.use_ch === "y") {
        options.push(option);
      }
    });

    setHospitalsOptions(options);
    if (options.length) {
      setSelectedHospital(options[0].value);
    }
  }, [hospitals]);

  // 환자목록 설정
  useEffect(() => {
    if (selectedHospital) {
      // 한국 기관의 경우, 선택한 기관의 기관번호, 몽골 기관의 경우 해당 기관의 기관번호로 설정한다.
      const o_idx =
        userInfo.country === "korea"
          ? parseInt(selectedHospital)
          : userInfo.o_idx;

      const fetchPatients = async () => {
        const res = await getPatients(o_idx, searchInputs);
        if (res !== "ServerError") {
          setPatients(res);
        } else {
          console.log("환자목록 불러오기 실패");
        }
      };

      fetchPatients();
    }
  }, [selectedHospital, searchInputs]);

  // table menu 접근제한, 언어에 따른 option text 변경
  useEffect(() => {
    if (userInfo) {
      let { country, permission } = userInfo;
      let dropOptions = [];
      if (country === "korea") {
        if (permission === "admin") {
          dropOptions.push("remove");
        }
      }
      dropOptions.push("manage");

      setTableDropOptions(dropOptions);
    }
  }, [userInfo]);

  return (
    <div className="workflow-page page-contents">
      <MyHead subTitle="patients" />

      {/* 환자 등록,수정 모달 */}
      <ModalPortal>
        <PatientModalBox
          regist_u_idx={userInfo?.u_idx}
          org={
            userInfo?.country === "korea"
              ? hospitals.find((o) => o.o_idx == parseInt(selectedHospital))
              : hospitals[0]
          }
          patient={
            modalType === "manage"
              ? patients.find((p) => p.p_idx === selectedPatientIdx.current)
              : null
          }
          closeModal={closeModal}
          type={modalType}
          onComplete={onComplete}
        />
      </ModalPortal>

      {/* 환자 목록 삭제 확인 모달 */}
      <RemoveModalPortal>
        <ConfirmAlertBox
          handleClose={closeRemoveModal}
          handleMainClick={removePatient}
          iconType="remove"
          title={langFile[lang].DELETE_PATIENT_ALERT_TITLE} // 환자를 삭제하시겠습니까?
          desc={langFile[lang].DELETE_PATIENT_ALERT_DESC} // 삭제 버튼을 클릭하시면 환자가 삭제됩니다.
        />
      </RemoveModalPortal>

      {/* 완료 알림 모달 */}
      <AlertModalPortal>
        <CheckAlertbox
          handleClose={closeAlertModal}
          title={
            modalType === "new"
              ? langFile[lang].ADD_PATIENT_ALERT_TITLE // 환자 등록 완료
              : modalType === "manage"
              ? langFile[lang].EDIT_PATIENT_ALERT_TITLE // 환자 정보 수정 완료
              : langFile[lang].CP_DELETE_PATIENT_ALERT_TITLE // 환자 삭제 완료
          }
          desc={
            modalType === "new"
              ? langFile[lang].ADD_PATIENT_ALERT_DESC // 환자 등록이 완료되었습니다.
              : modalType === "manage"
              ? langFile[lang].EDIT_PATIENT_ALERT_DESC // 환자 정보 수정이 완료되었습니다.
              : langFile[lang].CP_DELETE_PATIENT_ALERT_DESC // 환자 삭제가 완료되었습니다.
          }
        />
      </AlertModalPortal>

      {/* 검색 영역 */}
      <SearchPatientsContent
        lang={lang}
        onComplete={handleSearchComplete}
        o_idx={selectedHospital}
      />

      {/* 병원 filter, 등록 영역 */}
      <div
        className={`flex controll-table-area ${
          userInfo && userInfo.country === "korea"
            ? "justify-between"
            : "justify-end"
        }`}
      >
        {userInfo && userInfo.country === "korea" && (
          <Select
            options={hospitalsOptions}
            selectType="hospitalSelect"
            selected={selectedHospital}
            setSelected={setSelected}
          />
        )}

        <AddButton
          text={langFile[lang].ADD_PATIENT_BUTTON_TEXT} // 환자 등록하기
          onClick={addPatient}
        />
      </div>

      {/* 환지 목록 table 영역 */}
      <table className="w-full table">
        <TableHead tds={tds} />
        <tbody>
          {patients.map(
            ({
              p_idx,
              address,
              nurse_idx,
              nurse_name_eng,
              nurse_name_kor,
              u_name_eng,
              p_chart_no,
              tel,
              registdate_utc,
            }) => (
              <TableRow<TableMenuOption>
                key={p_idx}
                handleClick={() => handleTableRowBtnClick(p_idx)}
                buttonText={langFile[lang].PATIENT_CHART_LIST_TEXT} // 진료 관리
                onClickMenu={(type) => onClickMenu(type, p_idx)}
                // menuOptions={tableMenuOptions}
                tableRowOptionType={tableDropOptions}
                lang={lang}
              >
                <td>{p_chart_no ? p_chart_no : "-"}</td>
                <td>{u_name_eng}</td>
                <td>{tel ? tel : "-"}</td>
                <td>{address ? address : "-"}</td>
                <td>
                  {nurse_idx
                    ? lang === "en"
                      ? nurse_name_eng
                      : nurse_name_kor
                    : "-"}
                </td>
                <td>
                  {convertTimeToStr(
                    userInfo?.country,
                    registdate_utc.toString(),
                    "."
                  )}
                </td>
              </TableRow>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

WorkflowPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function getTableHeadData(lang: LangType) {
  const tds: TableHeadCol[] = [
    {
      key: langFile[lang].PATIENT_CODE_TEXT, // 환자번호
      valueType: "id",
      type: "text",
    },
    {
      key: langFile[lang].PATIENT_NAME_TEXT, // 환자명
      valueType: "localName",
      type: "text",
    },
    {
      key: langFile[lang].PATIENT_TEL_TEXT, // 연락처
      valueType: "phone",
      type: "text",
    },
    {
      key: langFile[lang].PATIENT_ADDRESS_TEXT, // 집주소
      valueType: "address",
      type: "text",
    },
    {
      key: langFile[lang].PATIENT_NURSE_IN_CHARGE_TEXT, // 담당 간호사
      valueType: "localName",
      type: "text",
    },
    {
      key: langFile[lang].PATIENT_REGIST_DATE_TEXT, // 등록일
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
