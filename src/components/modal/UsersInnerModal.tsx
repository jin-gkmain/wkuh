import React, { useContext, useState, useEffect } from "react";
import ModalFrame from "./ModalFrame";
import TableHead from "../common/table/TableHead";
import TableRow from "../common/table/TableRow";
import langFile from "@/lang";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import { useAppSelector } from "@/store";
import { convertTimeToStr } from "@/utils/date";
import { getOrg } from "@/data/org";
import { getUsersByOIdx } from "@/data/users";

export type UsersInnerModalJobType =
  | "doctor"
  | "nurse"
  | "medical"
  | "not-patient";

type Props<T> = {
  o_idx: number;
  closeModal: () => void;
  onSelect: (name: User, key?: T) => void;
  key?: T;
  job?: UsersInnerModalJobType;
};

export default function UsersInnerModal<T>({
  o_idx,
  closeModal,
  onSelect,
  key,
  job,
}: Props<T>) {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { webLang } = useContext(LanguageContext);
  const tds = getTableHeadData(webLang);
  const [users, setUsers] = useState<null | User[]>(null);
  const [org, setOrg] = useState<null | Organization>(null);

  // 사용자, 기관 데이터 불러오기
  useEffect(() => {
    (async () => {
      let userData = await getUsersByOIdx(o_idx);
      if (userData !== "ServerError") {
        if (job) {
          if (job === "doctor" || job === "nurse") {
            userData = userData.filter((u) => u.job === job);
          } else if (job === "medical") {
            userData = userData.filter(
              (u) => u.job === "doctor" || u.job === "nurse"
            );
          } else if (job === "not-patient") {
            userData = userData.filter((u) => u.job !== "patient");
          }
        }
        setUsers(userData);
      } else {
        console.log("사용자 목록 불러오기 실패");
      }

      const orgData = await getOrg(o_idx);
      if (orgData !== "ServerError") {
        setOrg(orgData);
      } else {
        console.log("기관 detail 정보 불러오기 실패");
      }
    })();
  }, []);

  const onSelectUser = (id: number) => {
    if (users) {
      const selected = users.find((u) => u.u_idx === id);
      if (selected) {
        onSelect(selected, key);
        closeModal();
      }
    }
  };

  return (
    <div className="users-inner-modal">
      <ModalFrame
        hideBtns={true}
        title={langFile[webLang].SEARCH_MANAGER_MODAL_TITLE_TEXT} // 담당자 선택
        onClose={closeModal}
        onComplete={null}
      >
        <table className="table">
          <TableHead tds={tds} />

          <tbody>
            {users &&
              users.map(
                ({
                  u_code,
                  u_idx,
                  u_id,
                  registdate_utc,
                  u_name_eng,
                  u_name_kor,
                  permission,
                  job,
                }) => (
                  <TableRow
                    key={u_idx}
                    buttonText={
                      langFile[webLang].SEARCH_MANAGER_MODAL_SELECT_BUTTON
                    } // 선택하기
                    handleClick={() => onSelectUser(u_idx)}
                    menu={false}
                  >
                    <td>{u_code}</td>
                    <td>{webLang === "ko" ? u_name_kor : u_name_eng}</td>
                    <td>
                      {permission === "admin"
                        ? langFile[webLang].USER_MODAL_USER_PERMISSION1
                        : langFile[webLang].USER_MODAL_USER_PERMISSION2}
                    </td>
                    <td>
                      {job === "doctor" &&
                        langFile[webLang].USER_MODAL_USER_JOB2}
                      {/* 의사 */}

                      {job === "nurse" &&
                        langFile[webLang].USER_MODAL_USER_JOB1}
                      {/* 간호사 */}

                      {job === "interpreter" &&
                        langFile[webLang].USER_MODAL_USER_JOB3}
                      {/* 통역사 */}

                      {job === "admin" &&
                        langFile[webLang].USER_MODAL_USER_JOB6}
                      {/* 관리자 */}

                      {job === "patient" &&
                        langFile[webLang].USER_MODAL_USER_JOB5}
                      {/* 환자 */}

                      {job === "ect" && langFile[webLang].USER_MODAL_USER_JOB4}
                      {/* 기타 */}
                    </td>
                    <td>{u_id}</td>
                    <td>
                      {org
                        ? webLang === "ko"
                          ? org.o_name_kor
                          : org.o_name_eng
                        : ""}
                    </td>
                    <td>
                      {convertTimeToStr(
                        userInfo.country === "korea" ? "KR" : "MN",
                        registdate_utc.toString(),
                        "."
                      )}
                    </td>
                  </TableRow>
                )
              )}
          </tbody>
        </table>
      </ModalFrame>
    </div>
  );
}

function getTableHeadData(lang: LangType) {
  const tds: TableHeadCol[] = [
    {
      key: langFile[lang].USER_CODE_TEXT, // 사용자번호
      valueType: "id",
      type: "text",
    },
    {
      key: langFile[lang].SEARCH_MANAGER_USER_NAME, // 사용자명
      valueType: "localName",
      type: "text",
    },
    {
      key: langFile[lang].USER_PERMISSION_TEXT, // 권한
      valueType: "number",
      type: "text",
    },
    {
      key: langFile[lang].USER_JOB_TEXT, // 직무
      valueType: "number",
      type: "text",
    },

    {
      key: langFile[lang].USER_EMAIL_TEXT, // 이메일(ID)
      valueType: "email",
      type: "text",
    },

    {
      key: langFile[lang].SEARCH_MANAGER_ORGANIZATION, // 소속기관
      valueType: "organization",
      type: "text",
    },
    {
      key: langFile[lang].USER_REGIST_DATE_TEXT, // 등록일
      valueType: "date",
      type: "text",
    },

    {
      key: "",
      type: "button",
    },
  ];

  return tds;
}
