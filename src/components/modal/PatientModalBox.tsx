import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ModalFrame from "../modal/ModalFrame";
import SelectInput from "../common/inputs/SelectInput";
import DateInput, { Value } from "../common/inputs/DateInput";
import { LanguageContext } from "@/context/LanguageContext";
import langFile from "@/lang";
import instance from "@/utils/myAxios";
import dayjs from "dayjs";
import { editPatient, getPatients, registPatient } from "@/data/patient";
import Select from "../common/inputs/Select";
import CheckDuplicateInput from "../common/inputs/CheckDuplicateInput";
import { getOrg } from "@/data/org";

type Props = {
  regist_u_idx?: number;
  org?: Organization;
  closeModal: () => void;
  type: ModalType;
  onComplete: (data?: any) => void;
  patient?: PatientModal | null;
};

export type ChartIdDuplicated =
  | "ready"
  | "success"
  | "fail"
  | "length"
  | "notCheck"
  | "modify";

export default function PatientModalBox({
  regist_u_idx,
  closeModal,
  type,
  onComplete,
  patient,
  org,
}: Props) {
  const { webLang } = useContext(LanguageContext);
  const sexOptions = getSexOptions();
  const [chartIdCheck, setChartIdCheck] = useState<ChartIdDuplicated>("ready");
  const [pIdCheck, setPIdCheck] = useState<ChartIdDuplicated>("ready");

  const [patientInfo, setPatientInfo] = useState<PatientModal>({
    p_idx: 0,
    u_name_eng: "",
    sex: sexOptions[0].value,
    birthday: null,
    weight: "",
    tall: "",
    tel: "",
    visit_paths: "",
    nurse_idx: null,
    nurse_name_eng: "",
    nurse_name_kor: "",
    p_chart_no: 0,
    p_email: "",
    p_id: "",
    address: "",
    note: "",
    p_serial_no: "",
  });

  const [inputAlert, setInputAlert] = useState({
    u_name_eng: false,
    p_serial_no: false,
  });

  const accountRef = useRef("");
  const serialNoRef = useRef("");

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    const {
      p_idx,
      p_chart_no,
      nurse_idx,
      u_name_eng,
      sex,
      birthday,
      weight,
      tall,
      tel,
      address,
      note,
      visit_paths,
      p_serial_no,
      p_id,
      p_email,
    } = patientInfo;

    let submitable = true;
    if (!u_name_eng.trim()) {
      setInputAlert((prev) => ({ ...prev, u_name_eng: true }));
      submitable = false;
    } else {
      setInputAlert((prev) => ({ ...prev, u_name_eng: false }));
    }

    if (!p_serial_no.trim().length) {
      submitable = false;
      return setInputAlert((prev) => ({ ...prev, p_serial_no: true }));
    }

    if (pIdCheck === "fail") submitable = false;

    if (chartIdCheck !== "success") {
      if (
        !(
          type === "manage" &&
          serialNoRef.current === patientInfo.p_serial_no &&
          chartIdCheck === "ready"
        )
      ) {
        submitable = false;
        setInputAlert((prev) => ({ ...prev, p_serial_no: true }));
      }
    }

    if (!submitable) return;

    let body: any = {
      nurse_idx: nurse_idx || null,
      p_chart_no:
        type === "manage" ? p_chart_no : `${org.o_code}-${p_serial_no}`,
      u_name_eng,
      u_name_kor: " ",
      sex,
      birthday,
      weight,
      tall,
      tel,
      address,
      note,
      visit_paths,
      p_serial_no,
      p_id,
      p_email,
    };

    if (type === "new") {
      const res = await registPatient(org.o_idx, regist_u_idx, body);
      if (res === "SUCCESS") {
        onComplete();
      } else {
        console.log("환자 등록 실패");
      }
    } else if (type === "manage") {
      // ✨ 환자 수정 api 통신...
      // 성공시 onComplete에 수정된 환자 정보를 전달하여 환자 정보를 수정하도록한다.
      const res = await editPatient(p_idx, body);
      if (res === "SUCCESS") {
        onComplete({
          ...patientInfo,
          p_chart_no: `${org.o_code}_${p_serial_no}`,
        });
      } else {
        console.log("환자 정보 수정 실패");
      }
    }
  };

  // input 변경된 값 반영
  const handleChangeInput = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;

    if (name === "p_serial_no") {
      if (!value.trim().length) {
        if (patientInfo.p_id.trim().length) {
          setPatientInfo((prev) => ({ ...prev, p_id: "" }));
          setPIdCheck("ready");
        }
      }
      if (chartIdCheck === "success") {
        setChartIdCheck("ready");
        setInputAlert((prev) => ({ ...prev, p_serial_no: false }));
      }
    }

    setPatientInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 생년월일 선택
  const getDates = useCallback((dates: Value) => {
    if (dates && !Array.isArray(dates)) {
      setPatientInfo((prev) => ({
        ...prev,
        birthday: dayjs(dates).format("YYYYMMDD"),
      }));
    }
  }, []);

  // 담당간호사 선택
  const handleSelectInput = (user: User) => {
    const { u_idx, u_name_eng, u_name_kor } = user;

    setPatientInfo((prev) => ({
      ...prev,
      nurse_idx: u_idx,
      nurse_name_eng: u_name_eng,
      nurse_name_kor: u_name_kor,
    }));
  };

  // 성별 선택
  const handleSelect = (selected: string) => {
    setPatientInfo((prev) => ({ ...prev, sex: selected }));
  };

  // 계정 생성
  const createAccount = () => {
    if (chartIdCheck !== "success") {
      setPIdCheck("fail");
      setInputAlert((prev) => ({ ...prev }));
      return;
    } else {
      setPatientInfo((prev) => ({
        ...prev,
        p_id: prev.p_serial_no,
      }));
      setPIdCheck("success");
    }
  };

  // 환자 시리얼 넘버 중복확인
  const checkSerialNumber = async () => {
    if (!patientInfo.p_serial_no.trim().length) return;
    try {
      const res = await instance.post("/serial_no_duplicate", {
        p_serial_no: patientInfo.p_serial_no,
      });

      // 환자 serial number 사용 가능한 경우
      if (res.data.result === "USABLE") {
        setChartIdCheck("success");

        setInputAlert((prev) => ({ ...prev, p_serial_no: true }));
        if (patientInfo.p_id || pIdCheck === "fail") {
          setPIdCheck("success");
          setPatientInfo((prev) => ({
            ...prev,
            p_id: patientInfo.p_serial_no,
          }));
        }
      } else {
        setChartIdCheck("fail");

        setInputAlert((prev) => ({ ...prev, p_serial_no: true }));
      }
    } catch (err) {}
  };

  // 환자정보를 수정하는 경우로, 선택한 환자 정보의 초기 설정을 수행
  useEffect(() => {
    getPatients(org.o_idx, {}).then((res) => {
      if (res !== "ServerError") {
        setPatientInfo((prev) => ({
          ...prev,
          p_serial_no:
            org.domain.replace("@", "").split(".")[0] +
            "-" +
            (res.length + 1).toString().padStart(4, "0"),
        }));
      } else {
        setPatientInfo((prev) => ({
          ...prev,
          p_serial_no: org.o_code + "-" + "1",
        }));
      }
    });

    if (patient) {
      setPatientInfo(patient);
      // 환자 계정 변경 여부를 파악하기 위해 환자의 계정이 있는 경우 그 값을 ref에 저장한다.
      if (patient.p_id) {
        accountRef.current = patient.p_id;
      }
      if (patient.p_serial_no) {
        serialNoRef.current = patient.p_serial_no;
      }
    }
  }, [patient, org]);

  return (
    <div className="patient-modal-box">
      <ModalFrame
        title={
          type === "new"
            ? langFile[webLang].PATIENT_MODAL_NEW_TITLE_TEXT // 환자 등록
            : langFile[webLang].PATIENT_MODAL_MANAGE_TITLE_TEXT // 환자 정보 수정
        }
        completeBtnText={
          webLang !== "ko"
            ? langFile[webLang].PATIENT_MODAL_COMPLETE_BUTTON_TEXT
            : ""
        }
        onClose={closeModal}
        onComplete={handleSubmit}
      >
        <div className="input-col-wrap">
          <div className="input-row-wrap">
            <section className="flex-1 flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <label htmlFor="u_name_eng" className="label">
                  *{langFile[webLang].PATIENT_MODAL_PATIENT_NAME_EN}
                  {/* 환자명(영문) */}
                </label>
                <input
                  autoComplete="off"
                  onChange={handleChangeInput}
                  value={patientInfo.u_name_eng}
                  type="text"
                  className={`input ${
                    inputAlert.u_name_eng ? "alert-border-color" : ""
                  }`}
                  id="u_name_eng"
                  name="u_name_eng"
                />
              </div>
              <div className="flex flex-col gap-5">
                <span className="label">
                  {langFile[webLang].PATIENT_MODAL_SEX_TEXT}
                </span>
                <Select
                  selected={patientInfo.sex}
                  options={sexOptions}
                  setSelected={handleSelect}
                  selectType="sex"
                />
              </div>
              <div className="flex flex-col gap-5">
                <label htmlFor="weight" className="label">
                  {langFile[webLang].PATIENT_MODAL_WEIGHT_TEXT}
                  {/* 몸무게(kg) */}
                </label>
                <input
                  autoComplete="off"
                  onChange={handleChangeInput}
                  value={patientInfo.weight || ""}
                  type="text"
                  className="input"
                  id="weight"
                  name="weight"
                />
              </div>
              <div className="flex flex-col gap-5">
                <label htmlFor="tel" className="label">
                  {langFile[webLang].PATIENT_TEL_TEXT}
                  {/* 연락처 */}
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  className="input"
                  id="tel"
                  name="tel"
                  onChange={handleChangeInput}
                  value={patientInfo.tel || ""}
                />
              </div>
            </section>

            <section className="flex-1 flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <span className="label">
                  {langFile[webLang].PATIENT_MODAL_BIRTH_TEXT}
                  {/* 생년월일 */}
                </span>
                <DateInput
                  onComplete={getDates}
                  range={false}
                  value={
                    patientInfo.birthday
                      ? new Date(
                          dayjs(patientInfo.birthday).format("YYYY-MM-DD")
                        )
                      : null
                  }
                />
              </div>

              <div className="flex flex-col gap-5">
                <label htmlFor="tall" className="label">
                  {langFile[webLang].PATIENT_MODAL_TALL_TEXT}
                  {/* 신장(cm) */}
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  className="input"
                  id="tall"
                  name="tall"
                  onChange={handleChangeInput}
                  value={patientInfo.tall || ""}
                />
              </div>

              <div className="flex flex-col gap-5">
                <label htmlFor="visit_paths" className="label">
                  {langFile[webLang].PATIENT_MODAL_VISIT_PATHS_TEXT}
                  {/* 내원경로 */}
                </label>
                <input
                  autoComplete="off"
                  onChange={handleChangeInput}
                  value={patientInfo.visit_paths || ""}
                  type="text"
                  className="input"
                  id="visit_paths"
                  name="visit_paths"
                />
              </div>

              <div className="flex flex-col gap-5">
                <label htmlFor="p_email" className="label">
                  {langFile[webLang].PATIENT_MODAL_P_EMAIL_TEXT}
                  {/* 이메일 */}
                </label>
                <input
                  autoComplete="off"
                  onChange={handleChangeInput}
                  value={patientInfo.p_email || ""}
                  type="text"
                  className="input"
                  id="p_email"
                  name="p_email"
                />
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-10">
            <label htmlFor="address" className="label">
              {langFile[webLang].PATIENT_ADDRESS_TEXT}
              {/* 집주소 */}
            </label>
            <input
              autoComplete="off"
              type="text"
              id="address"
              className="input"
              name="address"
              onChange={handleChangeInput}
              value={patientInfo.address || ""}
            />
          </div>

          <div className="input-row-wrap">
            <div className="input-col-wrap flex-1">
              <span className="label">
                {langFile[webLang].PATIENT_MODAL_NURSE_IN_CHARGE_TEXT}
                {/* 담당 간호사(기관소속) */}
              </span>
              <SelectInput
                usersJobType="nurse"
                o_idx={org.o_idx}
                onSelect={handleSelectInput}
                label
                selected={
                  patientInfo.nurse_idx
                    ? webLang === "ko"
                      ? patientInfo.nurse_name_kor
                      : patientInfo.nurse_name_eng
                    : ""
                }
                disabled={false}
              />
            </div>
            <div className="input-col-wrap flex-1">
              <label htmlFor="p_serial_no" className="label">
                *{langFile[webLang].PATIENT_MODAL_SERIAL_NUMBER_TEXT1}
                {/* 환자 일련번호 */}
                <span className="meta-info">
                  {langFile[webLang].PATIENT_MODAL_SERIAL_NUMBER_TEXT2}
                  {/* *일련번호 수정시 환자 계정도 함께 수정됩니다. */}
                </span>
              </label>

              <CheckDuplicateInput
                name="p_serial_no"
                handleInputChange={handleChangeInput}
                value={patientInfo.p_serial_no}
                alert={inputAlert.p_serial_no}
                alertType={chartIdCheck === "success" ? "success" : "fail"}
                checkDuplicate={checkSerialNumber}
                alertText={
                  chartIdCheck === "success"
                    ? langFile[webLang].PATIENT_SERIAL_NUMBER_AVAILABLE_TEXT
                    : chartIdCheck === "fail"
                    ? langFile[webLang].PATIENT_SERIAL_NUMBER_DUPLICATED_TEXT
                    : ""
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <label htmlFor="note" className="label">
              {langFile[webLang].ORG_MODAL_MEMO_TEXT}
              {/* 메모 */}
            </label>
            <input
              autoComplete="off"
              type="text"
              id="note"
              className="input"
              name="note"
              onChange={handleChangeInput}
              value={patientInfo.note || ""}
            />
          </div>

          <div className="input-col-wrap create-account">
            <span className="label">
              {langFile[webLang].PATIENT_MODAL_GENERATE_ACCOUNT_TEXT1}
              {/* 계정생성 */}
              <span className="meta-info">
                {langFile[webLang].PATIENT_MODAL_GENERATE_ACCOUNT_TEXT2}
                {/* *환자 일련번호 등록시에만 생성 가능하며, 초기 ID와 PW는 모두
                환자 일련번호로 설정됩니다. (일련번호 수정시에도 적용) */}
              </span>
            </span>

            <div
              className={`w-full relative id-box input flex input-disabled ${
                pIdCheck === "success"
                  ? "success-border-color"
                  : pIdCheck === "fail"
                  ? "alert-border-color"
                  : ""
              }`}
            >
              <div className="w-full p_id">
                {patientInfo.p_id ? "ID: " + patientInfo.p_id : ""}
              </div>

              <span className="alert-text-absolute">
                {pIdCheck === "fail"
                  ? langFile[webLang].PATIENT_SERIAL_NUMBER_FIRST_TEXT // 환자 일련번호를 먼저 등록해주세요
                  : pIdCheck === "success" && type === "manage"
                  ? langFile[webLang].EDIT_PATIENT_ACCOUNT_TEXT // 일련번호에 따라 계정이 수정되었습니다. 환자에게도 알려주세요
                  : ""}
              </span>

              <button
                disabled={type === "manage"}
                type="button"
                onClick={createAccount}
                className="h-full shrink-0"
              >
                {langFile[webLang].PATIENT_CREATE_PATIENT_ACCOUNT_BUTTON}
                {/* 중복검사 */}
              </button>
            </div>
          </div>
        </div>
      </ModalFrame>
    </div>
  );
}

function getSexOptions() {
  return [
    {
      key: "M",
      value: "M",
    },
    {
      key: "F",
      value: "F",
    },
  ];
}
