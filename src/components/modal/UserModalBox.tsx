import React, {
  ChangeEvent,
  FormEvent,
  useRef,
  useContext,
  useEffect,
  useState,
} from "react";
import ModalFrame from "../modal/ModalFrame";
import Select from "../common/inputs/Select";
import langFile from "@/lang";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import instance from "@/utils/myAxios";
import { editUser, registUser } from "@/data/users";
import CheckDuplicateInput from "../common/inputs/CheckDuplicateInput";

type Props = {
  regist_u_idx?: number;
  org: Organization;
  userData?: User | null;
  onComplete: (data?: any) => void;
  closeModal: () => void;
  type: ModalType;
};

export default function UserModalBox({
  regist_u_idx,
  org,
  closeModal,
  type,
  onComplete,
  userData,
}: Props) {
  const { lang } = useContext(LanguageContext);
  const permissionOptions = getPermissionOptions(lang as "ko" | "en");

  const [user, setUser] = useState<UserModal>({
    u_idx: 0,
    o_idx: 0,
    u_code: "",
    p_idx: 0,
    u_name_kor: "",
    u_name_eng: "",
    u_id: "",
    tel: "",
    permission: permissionOptions[0].value,
    job: "doctor",
    note: "",
    medical_dept: "1",
    country: "korea",
  });
  const jobOptions = getJobOptions(lang as "ko" | "en", user.job);
  const medicalDeptOptions = getMedicalDeptOptions(
    lang as "ko" | "en",
    user.job
  );
  const [idDuplicated, setIdDuplicated] = useState<
    "ready" | "success" | "duplicated"
  >("ready");
  const [idAlert, setIdAlert] = useState(false);
  const userId = useRef("");

  // SelectInput 값 설정
  function setSelectedValue<SelectType>(
    selected: string,
    selectType: SelectType
  ) {
    if (selectType === "job") setUser((prev) => ({ ...prev, job: selected }));
    else if (selectType === "permission")
      setUser((prev) => ({ ...prev, permission: selected }));
    else if (selectType === "medical_dept")
      setUser((prev) => ({ ...prev, medical_dept: selected }));
  }

  // 사용자 수정, 등록
  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    console.log("user > ", user);
    const {
      u_idx,
      u_code,
      u_name_eng,
      u_name_kor,
      u_id,
      tel,
      permission,
      job,
      note,
      medical_dept,
    } = user;

    if (!u_id.trim().length || idDuplicated !== "success") {
      if (
        !(
          idDuplicated === "ready" &&
          type === "manage" &&
          userId.current === user.u_id
        )
      ) {
        return setIdAlert(true);
      }
    }

    let body: any = {
      u_code,
      u_name_eng,
      u_name_kor,
      u_id: u_id + org.domain,
      tel,
      permission,
      job,
      note,
      country: org.country,
      medical_dept: medical_dept ? Number(medical_dept) : null,
    };
    console.log("body > ", body);
    // 시용자 등록 모달에서 submit 한 경우
    if (type === "new") {
      // body.u_code = `${org.o_code}_U_018`; // 자동 생성전 임시코드
      body.u_pwd = body.u_id;

      const res = await registUser(org.o_idx, regist_u_idx, body);
      console.log("res > ", res);
      if (res === "SUCCESS") {
        onComplete();
      } else {
        console.log("사용자 등록 실패");
      }
    }
    // 사용자 관리 모달에서 submit 한 경우
    else if (type === "manage") {
      const res = await editUser(u_idx, body);
      if (res === "SUCCESS") {
        onComplete({ ...user, u_id: u_id + org.domain });
      } else {
        console.log("사용자 정보 수정 실패");
      }
    }
  };

  // input 값 update
  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    console.log("===");
    const target = ev.target;
    let { name, value } = target;

    if (name === "u_id") {
      if (idDuplicated === "success") {
        setIdDuplicated("ready");
        setIdAlert(false);
      } else if (idDuplicated === "duplicated") {
        if (userId.current === value) {
          setIdDuplicated("ready");
          setIdAlert(false);
        }
      }
    }

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // 아이디 중복체크
  const checkIdDuplicated = async () => {
    try {
      const res = await instance.post("/id_duplicate", {
        u_id: `${user.u_id}${org.domain}`,
      });

      const data: MyResponse<"USABLE" | "DUPLICATE"> = res.data;
      if (data.result === "USABLE") {
        setIdDuplicated("success");
        setIdAlert(true);
      } else {
        setIdDuplicated("duplicated");
        setIdAlert(true);
        alert(langFile[lang].USER_ALERT_DUPLICATED_ID); // 중복되는 아이디 입니다.
      }
    } catch (err) {
      console.log("아이디 중복확인 에러 / 500");
    }
  };

  // 사용자 관리시 선택한 사용자 정보 초기 설정
  useEffect(() => {
    if (userData) {
      setUser({
        ...userData,
        u_id: userData.u_id.slice(0, userData.u_id.lastIndexOf("@")),
      });
      userId.current = userData.u_id.slice(0, userData.u_id.lastIndexOf("@"));
    } else {
      setUser((prev) => ({ ...prev, o_idx: org.o_idx }));
    }
  }, []);

  return (
    <div className="user-modal-box">
      <ModalFrame
        title={
          type === "new"
            ? langFile[lang].USER_MODAL_NEW_TITLE_TEXT // 사용자 등록
            : langFile[lang].USER_MODAL_MANAGE_TITLE_TEXT // 사용자 정보 수정
        }
        completeBtnText={
          lang !== "ko" ? langFile[lang].USER_MODAL_COMPLETE_BUTTON_TEXT : ""
        }
        onClose={closeModal}
        onComplete={handleSubmit}
      >
        <div className="flex flex-col">
          <div className="flex flex-col gap-10">
            <div className="input-row-wrap">
              <section className="flex-1 flex flex-col gap-10">
                <div className="flex flex-col gap-10">
                  <label htmlFor="u_name_eng" className="label">
                    {langFile[lang].USER_MODAL_USER_NAME_EN_TEXT}
                    {/* 사용자명(영문) */}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="input"
                    id="u_name_eng"
                    name="u_name_eng"
                    onChange={handleInputChange}
                    value={user.u_name_eng || ""}
                  />
                </div>

                <div className="flex flex-col gap-10">
                  <label htmlFor="u_id" className="label">
                    *{langFile[lang].USER_EMAIL_TEXT}
                    {/* 이메일(ID) */}
                  </label>
                  <div className="w-full flex">
                    <CheckDuplicateInput
                      disabled={type === "manage"}
                      name="u_id"
                      alert={idAlert}
                      alertType={
                        idDuplicated === "success" ? "success" : "fail"
                      }
                      checkDuplicate={checkIdDuplicated}
                      value={user.u_id}
                      handleInputChange={handleInputChange}
                      alertText=""
                    >
                      <span className="o-code">
                        {org?.domain ? org.domain : ""}
                      </span>
                    </CheckDuplicateInput>
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  <span className="label">
                    {langFile[lang].USER_PERMISSION_TEXT}
                    {/* 권한 */}
                  </span>
                  <Select
                    disabled={user.job === "admin" || user.job === "patient"}
                    selected={user.permission}
                    options={permissionOptions}
                    setSelected={setSelectedValue}
                    selectType="permission"
                  />
                </div>
                <div className="flex flex-col gap-10">
                  <label htmlFor="note" className="label">
                    {langFile[lang].ORG_MODAL_MEMO_TEXT}
                    {/* 메모 */}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="note"
                    id="note"
                    className="input"
                    onChange={handleInputChange}
                    value={user.note || ""}
                  />
                </div>
              </section>

              <section className="flex-1 flex flex-col gap-10">
                <div className="flex flex-col gap-10">
                  <label htmlFor="u_name_kor" className="label">
                    {langFile[lang].USER_MODAL_USER_NAME_KO_TEXT}
                    {/* 사용자명(국문) */}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="input"
                    id="u_name_kor"
                    name="u_name_kor"
                    onChange={handleInputChange}
                    value={user.u_name_kor || ""}
                  />
                </div>

                <div className="flex flex-col gap-10">
                  <label htmlFor="tel" className="label">
                    {langFile[lang].USER_TEL_TEXT}
                    {/* 연락처 */}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="input"
                    id="tel"
                    name="tel"
                    onChange={handleInputChange}
                    value={user.tel || ""}
                  />
                </div>

                <div className="flex flex-col gap-10">
                  <span className="label">
                    {langFile[lang].USER_JOB_TEXT}
                    {/* 직무 */}
                  </span>
                  <Select
                    disabled={user.job === "patient" || user.job === "admin"}
                    selected={user.job}
                    options={jobOptions}
                    setSelected={setSelectedValue}
                    selectType="job"
                  />
                </div>
                <div className="flex flex-col gap-10">
                  <span className="label">
                    {langFile[lang].USER_SPECIALTY_TEXT}
                    {/* 진료과 */}
                  </span>
                  <Select
                    disabled={user.job === "patient" || user.job === "admin"}
                    selected={user.medical_dept?.toString() || ""}
                    options={medicalDeptOptions}
                    setSelected={setSelectedValue}
                    selectType="medical_dept"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </ModalFrame>
    </div>
  );
}

function getPermissionOptions(lang: LangType) {
  return [
    {
      key: langFile[lang].USER_MODAL_USER_PERMISSION1, // 관리자
      value: "admin",
    },
    {
      key: langFile[lang].USER_MODAL_USER_PERMISSION2, // 일반
      value: "user",
    },
  ];
}

function getJobOptions(lang: LangType, job: string) {
  const jobList = [
    {
      key: langFile[lang].USER_MODAL_USER_JOB1, // 간호사
      value: "nurse",
    },
    {
      key: langFile[lang].USER_MODAL_USER_JOB2, //의사
      value: "doctor",
    },
    {
      key: langFile[lang].USER_MODAL_USER_JOB3, //통역사
      value: "interpreter",
    },
    {
      key: langFile[lang].USER_MODAL_USER_JOB4, // 기타
      value: "ect",
    },
  ];

  if (job === "patient" || job === "admin") {
    jobList.push(
      {
        key: langFile[lang].USER_MODAL_USER_JOB5, // 환자
        value: "patient",
      },
      {
        key: langFile[lang].USER_MODAL_USER_JOB6, // 관리자
        value: "admin",
      }
    );
  }
  console.log("job > ", job);
  return jobList;
}

export function getMedicalDeptOptions(lang: LangType, job: string) {
  const medicalDeptList = [
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY1, // 내과
      value: "1",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY2, // 소화기내과
      value: "2",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY3, // 호흡기내과
      value: "3",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY4, // 심장내과
      value: "4",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY5, // 신장내과
      value: "5",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY6, // 내분비내과
      value: "6",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY7, // 혈액종양내과
      value: "7",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY8, // 감염내과
      value: "8",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY9, // 류마티스내과
      value: "9",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY10, // 알레르기내과
      value: "10",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY11, // 신경과
      value: "11",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY12, // 일반외과
      value: "12",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY13, // 흉부외과
      value: "13",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY14, // 신경외과
      value: "14",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY15, // 정형외과
      value: "15",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY16, // 성형외과
      value: "16",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY17, // 산부인과
      value: "17",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY18, // 비뇨기과
      value: "18",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY19, // 소아청소년과
      value: "19",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY20, // 소아외과
      value: "20",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY21, // 영상의학과
      value: "21",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY22, // 핵의학과
      value: "22",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY23, // 병리과
      value: "23",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY24, // 정신건강의학과
      value: "24",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY25, // 재활의학과
      value: "25",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY26, // 마취통증의학과
      value: "26",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY27, // 피부과
      value: "27",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY28, // 이비인후과
      value: "28",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY29, // 안과
      value: "29",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY30, // 가정의학과
      value: "30",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY31, // 치과
      value: "31",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY32, // 응급의학과
      value: "32",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY33, // 노인병내과
      value: "33",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY34, // 중환자학과
      value: "34",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY35, // 심장혈관센터
      value: "35",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY36, // 뇌혈관센터
      value: "36",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY37, // 장기이식센터
      value: "37",
    },
    {
      key: langFile[lang].USER_MODAL_USER_SPECIALTY38, // 종양센터
      value: "38",
    },
  ];
  if (job === "patient" || job === "admin") {
    medicalDeptList.push(
      {
        key: langFile[lang].USER_MODAL_USER_JOB5, // 환자
        value: "1",
      },
      {
        key: langFile[lang].USER_MODAL_USER_JOB6, // 관리자
        value: "2",
      }
    );
  }
  return medicalDeptList;
}
