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
import { LangType, LanguageContext } from "@/context/LanguageContext";
import Select from "../common/inputs/Select";
import dayjs from "dayjs";
import { useAppSelector } from "@/store";
import getOrgs, { editOrg, registOrg } from "@/data/org";
import getFiles, { deleteFile, uploadFiles } from "@/data/file";
import CheckDuplicateInput from "../common/inputs/CheckDuplicateInput";
import { ChartIdDuplicated } from "./PatientModalBox";

type Props = {
  item: Organization | null;
  closeModal: () => void;
  type: ModalType;
  onComplete: (data?: any) => void;
};

const gubun1 = "계약서";
const gubun2 = "첨부";

function OrganizationModalBox({ closeModal, type, onComplete, item }: Props) {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { webLang } = useContext(LanguageContext);
  const countrySelectOptions = getCountryOptions(webLang);
  const [domainCheck, setDomainCheck] = useState<ChartIdDuplicated>("ready");

  const [modalInfo, setModalInfo] = useState<OrganizationModal>({
    o_idx: 0,
    u_idx: 0,
    o_code: "",
    parent_o_idx: 0,
    o_name_kor: "",
    o_name_eng: "",
    country: "korea",
    domain: "",
    contract_sd: null,
    contract_ed: null,
    contract_email: "",
    contract_tel: "",
    note: "",
    u_name_kor: "",
    u_name_eng: "",
    qr_code: "",
  });
  const [inputAlert, setInputAlert] = useState({
    o_name_kor: false,
    u_idx: false,
    o_code: false,
    domain: false,
  });
  const [files, setFiles] = useState<File[] | SavedFile[]>([]);

  const isSavedFile = (file: File | SavedFile): file is SavedFile => {
    return (file as SavedFile).f_idx !== undefined;
  };

  const handleRemove = async (id: string) => {
    if (isSavedFile(files[0])) {
      const res = await deleteFile(parseInt(id));
      if (res === "SUCCESS") {
        setFiles((prev) =>
          (prev as SavedFile[]).filter((file) => file.f_idx.toString() !== id)
        );
      } else {
        console.log("파일 삭제 실패");
      }
    } else {
      setFiles((prev) => (prev as File[]).filter((file) => file.name !== id));
    }
  };

  // 파일 설정
  const setSelectedFiles = async (acceptedFiles: File[]) => {
    if (type === "manage") {
      const formData = getFormDataWithFiles(acceptedFiles);
      const res = await uploadFiles(
        formData,
        modalInfo.o_idx,
        userInfo.u_idx,
        gubun1,
        gubun2
      );
      if (res === "SUCCESS") {
        const res = await getFiles(modalInfo.o_idx, gubun1, gubun2);
        if (res !== "ServerError") {
          setFiles(res);
        }
      }
    } else {
      if (!files.length || !isSavedFile(files[0])) {
        setFiles((prev) => [...(prev as File[]), ...acceptedFiles]);
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

  // 모달 필수항목 확인
  const checkRequirements = (keys: Array<keyof Organization>) => {
    let submitable = true;
    keys.forEach((k) => {
      let val =
        typeof modalInfo[k] === "string" ? modalInfo[k].trim() : modalInfo[k];

      if (!val) {
        setInputAlert((prev) => ({ ...prev, [k]: true }));
        submitable = false;
      } else {
        setInputAlert((prev) => ({ ...prev, [k]: false }));
      }
    });

    return submitable;
  };

  // 전달받은 인자를 토대로 formData를 생성해 반환
  const getFormDataWithFiles = (acceptedFiles: (SavedFile | File)[]) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      if (!("f_idx" in file)) {
        formData.append("files", file);
      }
    });

    return formData;
  };

  // 기관 등록, 수정
  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const {
      o_idx,
      u_idx,
      o_code,
      parent_o_idx,
      o_name_kor,
      o_name_eng,
      country,
      domain,
      contract_ed,
      contract_sd,
      contract_email,
      contract_tel,
      note,
    } = modalInfo;

    let submitable = checkRequirements([
      "o_name_kor",
      "domain",
      "o_code",
      "u_idx",
    ]);

    if (!submitable) return;

    // 기관 등록 모달에서 submit 한 경우
    let body: any = {
      u_idx,
      o_code,
      o_name_eng,
      o_name_kor,
      country,
      domain: domain[0] !== "@" ? `@${domain.trim()}` : domain.trim(),
      contract_ed,
      contract_sd,
      contract_email,
      contract_tel,
      note,
    };
    // 기관 등록 모달에서 submit 한 경우
    if (type === "new") {
      const data = await registOrg(parent_o_idx, userInfo.u_idx, body);
      if (data.message === "SUCCESS") {
        const formData = getFormDataWithFiles(files);
        const res = await uploadFiles(
          formData,
          data.o_idx,
          userInfo.u_idx,
          "계약서",
          "첨부"
        );
        if (res === "SUCCESS") {
          onComplete();
        } else {
          console.log("기관 등록은 성공했는데, 파일 업로드에 실패한 경우");
        }
      } else {
        console.log("기관 등록 실패");
      }
    }
    // 기관 관리 모달에서 submit 한 경우
    else if (type === "manage") {
      body.parent_o_idx = parent_o_idx;
      const data = await editOrg(o_idx, body);
      if (data === "SUCCESS") {
        onComplete(modalInfo);
      } else {
        console.log("기관 정보 수정 오류");
      }
    }
  };

  // 담당자 선택
  const setManager = (user: User) => {
    setModalInfo((prev) => ({
      ...prev,
      u_name_kor: user.u_name_kor,
      u_name_eng: user.u_name_eng,
      u_idx: user.u_idx,
    }));
  };

  // input onChange시 변경된 값 반영
  const handleOnChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;
    const { name, value } = target;
    setModalInfo((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeInput = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;

    if (name === "domain") {
      if (!value.trim().length) {
        setDomainCheck("ready");
        setInputAlert((prev) => ({ ...prev, domain: false }));
      }
      if (domainCheck === "success") {
        setDomainCheck("ready");
        setInputAlert((prev) => ({ ...prev, domain: false }));
      }
    }

    setModalInfo((prev) => ({ ...prev, [name]: value }));
  };
  const checkDomainDuplicate = async () => {
    const res: Organization[] | "ServerError" = await getOrgs();
    if (res !== "ServerError") {
      for (const org of res) {
        if (org.domain.replace("@", "") === modalInfo.domain.replace("@", "")) {
          setDomainCheck("fail");
          return;
        }
      }
      setDomainCheck("success");
      setInputAlert((prev) => ({ ...prev, domain: true }));
    }
  };

  const getCountry = useCallback((country: string) => {
    return countrySelectOptions.find((i) => i.value === country).key;
  }, []);

  // 기관수정의 경우 page에서 props로 기관 정보를 받아와 초기 설정
  useEffect(() => {
    if (item) {
      setModalInfo(item);
    } else {
      setModalInfo((prev) => ({ ...prev, parent_o_idx: userInfo.o_idx }));
    }
  }, [item]);

  // 기관 수정의 경우 기존의 파일 목록 데이터 받아와 초기 설정
  useEffect(() => {
    if (type === "manage" && item) {
      // 파일 리스트 불러오기
      (async () => {
        const res = await getFiles(item.o_idx, gubun1, gubun2);
        if (res !== "ServerError") {
          setFiles(res);
        }
      })();
    }
  }, [type, item]);

  return (
    <div className="org-modal-box">
      <ModalFrame
        title={
          type === "new"
            ? langFile[webLang].ORG_MODAL_NEW_TITLE_TEXT // 기관 등록
            : langFile[webLang].ORG_MODAL_MANAGE_TITLE_TEXT // 기관 정보 수정
        }
        completeBtnText={
          webLang !== "ko"
            ? langFile[webLang].ORG_MODAL_COMPLETE_BUTTON_TEXT
            : ""
        }
        onClose={closeModal}
        onComplete={handleSubmit}
      >
        <div className="input-col-wrap">
          <div className="input-row-wrap">
            <section className="flex-1 input-col-wrap">
              <div className="input-col-wrap">
                <label htmlFor="o_name_kor" className="label">
                  *{langFile[webLang].ORG_MODAL_ORG_NAME_KO_TEXT}
                  {/* 기관명(국문) */}
                </label>
                <input
                  autoComplete="off"
                  value={modalInfo.o_name_kor!}
                  onChange={handleOnChange}
                  type="text"
                  className={`input ${
                    inputAlert.o_name_kor ? "alert-border-color" : ""
                  }`}
                  id="o_name_kor"
                  name="o_name_kor"
                />
              </div>

              <div className="input-col-wrap">
                <span className="label">
                  *{langFile[webLang].ORG_ORG_COUNTRY_TEXT}
                  {/* 국가 */}
                </span>
                <Select
                  selectType="country"
                  options={countrySelectOptions}
                  selected={modalInfo.country}
                  setSelected={(country: any) => {
                    console.log(country);
                    setModalInfo((prev) => ({
                      ...prev,
                      country: country,
                    }));
                    console.log(modalInfo);
                  }}
                />
              </div>

              <div className="input-col-wrap">
                <label htmlFor="contract_email" className="label">
                  {langFile[webLang].ORG_MODAL_ORG_CONTACT_EMAIL_TEXT}
                  {/* 기관 대표 메일 */}
                </label>
                <input
                  autoComplete="off"
                  value={modalInfo.contract_email || ""}
                  onChange={handleOnChange}
                  type="text"
                  className="input"
                  id="contract_email"
                  name="contract_email"
                />
              </div>

              <div className="input-col-wrap">
                <label htmlFor="domain" className="label">
                  *{langFile[webLang].ORG_MODAL_DOMAIN_FOR_MAIL}
                  {/* 메일용 도메인 */}
                </label>
                <CheckDuplicateInput
                  value={modalInfo.domain}
                  handleInputChange={handleChangeInput}
                  name="domain"
                  alert={inputAlert.domain}
                  alertType={domainCheck}
                  checkDuplicate={checkDomainDuplicate}
                  alertText=""
                />
              </div>

              <div className="input-col-wrap">
                <span className="label flex gap-3 align-center">
                  <FlagKoreaSq />*{langFile[webLang].ORG_MODAL_MANAGER_TEXT}
                  {/* 담당자 */}
                </span>
                <SelectInput
                  usersJobType="not-patient"
                  alert={inputAlert.u_idx}
                  o_idx={userInfo.o_idx}
                  onSelect={setManager}
                  label
                  selected={
                    webLang === "en"
                      ? modalInfo.u_name_eng
                      : modalInfo.u_name_kor
                  }
                />
              </div>
            </section>

            <section className="flex-1 input-col-wrap">
              <div className="input-col-wrap">
                <label htmlFor="o_name_eng" className="label">
                  {langFile[webLang].ORG_MODAL_ORG_NAME_EN_TEXT}
                  {/* 기관명(영문) */}
                </label>
                <input
                  autoComplete="off"
                  value={modalInfo.o_name_eng || ""}
                  onChange={handleOnChange}
                  type="text"
                  className="input"
                  id="o_name_eng"
                  name="o_name_eng"
                />
              </div>

              <div className="input-col-wrap">
                <span className="label">
                  {langFile[webLang].ORG_CONTRACT_DURATION_TEXT}
                  {/* 계약기간 */}
                </span>
                <DateInput
                  range={true}
                  onComplete={getDates}
                  value={
                    modalInfo.contract_sd
                      ? [
                          new Date(modalInfo.contract_sd),
                          new Date(modalInfo.contract_ed),
                        ]
                      : null
                  }
                />
              </div>

              <div className="input-col-wrap">
                <label htmlFor="contract_tel" className="label">
                  {langFile[webLang].ORG_MODAL_ORG_CONTACT_TEL_TEXT}
                  {/* 기관 대표 연락처 */}
                </label>
                <input
                  autoComplete="off"
                  value={modalInfo.contract_tel || ""}
                  onChange={handleOnChange}
                  type="text"
                  className="input"
                  id="contract_tel"
                  name="contract_tel"
                />
              </div>

              <div className="input-col-wrap">
                <label htmlFor="o_code" className="label">
                  *{langFile[webLang].ORG_MODAL_ORG_CODE_TEXT}
                  {/* 기관코드 */}
                </label>
                <input
                  autoComplete="off"
                  value={modalInfo.o_code}
                  onChange={handleOnChange}
                  type="text"
                  className={`input ${
                    inputAlert.o_code ? "alert-border-color" : ""
                  }`}
                  id="o_code"
                  name="o_code"
                />
              </div>
            </section>
          </div>

          <div className="input-col-wrap upload-area">
            <label className="label" htmlFor="note">
              {langFile[webLang].ORG_MODAL_MEMO_TEXT}
              {/* 메모 */}
            </label>
            <input
              autoComplete="off"
              type="text"
              name="note"
              id="note"
              className="input"
              value={modalInfo.note || ""}
              onChange={handleOnChange}
            />
          </div>

          <div className="input-col-wrap upload-area">
            <p className="label">
              {langFile[webLang].ORG_MODAL_ATTACH_CONTRACT_FILE}
              {/* 계약서 파일 첨부 */}
            </p>

            <DropFileInput
              labelText
              files={files}
              setFiles={setSelectedFiles}
              onRemove={handleRemove}
              type="pdf"
            />
          </div>
        </div>
      </ModalFrame>
    </div>
  );
}

export default React.memo(OrganizationModalBox);

function getCountryOptions(lang: LangType) {
  return [
    {
      key: langFile[lang].COUNTRY_KOREA, // 한국
      value: "korea",
    },
    {
      key: langFile[lang].COUNTRY_MONGOLIA, // 몽골
      value: "mongolia",
    },
    {
      key: langFile[lang].COUNTRY_KAZAKHSTAN, // 카자흐스탄
      value: "kazakhstan",
    },
  ];
}
