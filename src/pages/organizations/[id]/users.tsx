import Layout from "@/components/common/Layout";
import TableHead from "@/components/common/table/TableHead";
import TableRow from "@/components/common/table/TableRow";
import UserModalBox from "@/components/modal/UserModalBox";
import useModal from "@/hooks/useModal";
import React, { useContext, useEffect, useRef, useState } from "react";
import InfoBox, { InfoBoxType } from "@/components/common/InfoBox";
import useAlertModal from "@/hooks/useAlertModal";
import ConfirmAlertBox from "@/components/common/ConfirmAlertBox";
import CheckAlertbox from "@/components/common/CheckAlertBox";
import AddButton from "@/components/common/inputs/AddButton";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import langFile from "@/lang";
import { useRouter } from "next/router";
import { convertTimeToStr } from "@/utils/date";
import { useAppSelector } from "@/store";
import dayjs from "dayjs";
import { deleteUser, editUser, getUsersByOIdx } from "@/data/users";
import getOrgs, { getOrg } from "@/data/org";
import MyHead from "@/components/common/MyHead";
import QRCodeModal from "@/components/modal/QRCodeModal";

export default function UsersPage() {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { lang } = useContext(LanguageContext);
  const tds = getTableHeadData(lang as "ko" | "en");
  const [users, setUsers] = useState<User[]>([]);
  const [modalTypeVal, setModalTypeVal] = useState<ModalType>("new");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const infoKeys = getInfoBoxHeadData(lang as "ko" | "en");
  const { ModalPortal, openModal, closeModal } = useModal();
  const { AlertModalPortal, openAlertModal, closeAlertModal } = useAlertModal();
  const router = useRouter();

  // QR 코드 관련 상태
  const [qrString, setQrString] = useState("");
  const [qrFileName, setQrFileName] = useState("");

  const deletedUserId = useRef(0);

  // modal type 설정 및 상태 변경
  const modalOpen = (type: ModalType) => {
    setModalTypeVal(type);
    openModal();
  };

  // 사용자 목록 table에서 메뉴 버튼 클릭시 실행
  const handleTableMenu = (type: string, u_idx: number) => {
    // 관리자 권한을 가진 사용자만 사용자 삭제가 가능하도록 제한한다.
    if (userInfo?.permission !== "admin") return;

    deletedUserId.current = u_idx;

    modalOpen(type as ModalType);
  };

  // 사용자 등록, 수정 완료시 실행
  const onComplete = async (data: User) => {
    if (modalTypeVal === "new") {
      let orgId = router.query.id;
      if (Array.isArray(orgId)) return;

      if (orgId) {
        // ✨ 해당 기관의 사용자 목록 불러오기
        const data = await getUsersByOIdx(parseInt(orgId));

        if (data !== "ServerError") {
          setUsers(data);
          if (data.length) {
            setOrganization((prev) => ({
              ...prev,
              u_number: prev.u_number + 1,
            }));
          }
        } else {
          setUsers([]);
        }
      }
    }
    if (modalTypeVal === "manage") {
      // 인자로 전달받은 사용자 객체를 users에서 찾아서 정보를 update 한다.
      setUsers((prev) => prev.map((u) => (u.u_idx === data.u_idx ? data : u)));
    }
    closeModal();
    openAlertModal();
  };

  const handleConfirm = async () => {
    if (modalTypeVal === "disabled") {
      const data = await deleteUser(deletedUserId.current);
      if (data === "SUCCESS") {
        setUsers((prev) =>
          prev.map((u) =>
            u.u_idx === deletedUserId.current ? { ...u, use_ch: "n" } : { ...u }
          )
        );
        closeModal();
        openAlertModal();
      } else {
        console.log("사용자 삭제 실패");
      }
    } else if (modalTypeVal === "activate") {
      const matched = users.find((u) => u.u_idx === deletedUserId.current);
      if (matched) {
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
        } = matched;
        let body: any = {
          u_code,
          u_name_eng,
          u_name_kor,
          u_id,
          tel,
          permission,
          job,
          note,
          use_ch: "y",
          country: organization.country,
        };

        const res = await editUser(u_idx, body);
        if (res === "SUCCESS") {
          setUsers((prev) =>
            prev.map((u) =>
              u.u_idx === deletedUserId.current
                ? { ...u, use_ch: "y" }
                : { ...u }
            )
          );
          closeModal();
          openAlertModal();
        } else {
          console.log("사용자 정보 수정 실패");
        }
      }
    }
  };

  // 사용자 목록 table에서 button 클릭시 실행
  const handleTableClick = (u_idx: number) => {
    // 관리자 계정 외의 경우 사용자 관리 제한
    if (userInfo.permission !== "admin") return;
    deletedUserId.current = u_idx;
    modalOpen("manage");
  };

  // QR 코드 모달 열기 함수
  const handleDownloadQr = (qrData: string) => {
    // QR 코드 모달을 열기 위한 설정
    setQrString(qrData);
    setQrFileName(
      `${organization.o_name_eng || organization.o_name_kor}_qrcode`
    );
    modalOpen("qr");
  };

  // 기관정보, 사용자 목록 불러오기
  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.p_idx) {
      router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
      return;
    }

    const orgId = router.query.id;
    if (Array.isArray(orgId)) return;

    if (orgId) {
      // 해외 기관이 자신의 기관이 아닌 다른 기관의 사용자를 조회하려고 하는 경우
      if (userInfo.country !== "korea" && userInfo.o_idx != parseInt(orgId)) {
        router.replace(`/organizations/${userInfo.o_idx}/users`);
        return;
      } else {
        (async () => {
          // 기관정보
          const orgData = await getOrgs({ o_idx: parseInt(orgId) });
          if (orgData !== "ServerError") {
            if (orgData && orgData.length) {
              setOrganization(orgData[0]);
            } else {
              console.log("해당 id를 가진 기관 정보 x");
              router.replace("/organizations");
              return;
            }
          } else console.log("기관 정보 불러오기 실패 / 500");

          // 사용자 목록
          const usersData = await getUsersByOIdx(parseInt(orgId));
          if (usersData !== "ServerError") {
            setUsers(usersData);
          } else {
            console.log("사용자 목록 불러오기 실패 / 500");
          }
        })();
      }
    }
  }, [router.query.id, userInfo]);

  return (
    <Layout>
      <MyHead subTitle="users" />

      <div className="organizations-user-page page-contents">
        <ModalPortal>
          {modalTypeVal === "new" || modalTypeVal === "manage" ? (
            <UserModalBox
              regist_u_idx={userInfo?.u_idx}
              org={organization}
              userData={
                modalTypeVal === "new"
                  ? null
                  : users.find((u) => u.u_idx === deletedUserId.current)
              }
              closeModal={closeModal}
              type={modalTypeVal}
              onComplete={onComplete}
            />
          ) : modalTypeVal === "qr" ? (
            <QRCodeModal
              qrString={qrString}
              fileName={qrFileName}
              closeModal={closeModal}
            />
          ) : (
            <ConfirmAlertBox
              handleClose={closeModal}
              handleMainClick={handleConfirm}
              iconType={modalTypeVal}
              title={
                getConfirmModalText(modalTypeVal, lang as "ko" | "en").title
              }
              desc={getConfirmModalText(modalTypeVal, lang as "ko" | "en").desc}
            />
          )}
        </ModalPortal>

        <AlertModalPortal>
          <CheckAlertbox
            title={getAlertModalText(modalTypeVal, lang as "ko" | "en").title}
            desc={getAlertModalText(modalTypeVal, lang as "ko" | "en").desc}
            handleClose={closeAlertModal}
          />
        </AlertModalPortal>

        {/* 해당 환자의 진료 정보 */}
        <InfoBox
          keys={infoKeys.map((item) =>
            item.iconType === "qr"
              ? { ...item, onDownload: handleDownloadQr }
              : item
          )}
          data={
            organization
              ? {
                  o_name:
                    lang === "en"
                      ? organization.o_name_eng
                      : organization.o_name_kor,
                  u_number: organization.u_number,
                  p_number: organization.p_number,
                  completed_tele_number: organization.completed_tele_number,
                  completed_visit_number: organization.completed_visit_number,
                  duration: organization.contract_sd
                    ? `${dayjs(organization.contract_sd).format(
                        "YYYY.MM.DD"
                      )}~${dayjs(organization.contract_ed).format(
                        "YYYY.MM.DD"
                      )}`
                    : null,
                  contract_email: organization.contract_email,
                  qr_code:
                    "https://dev.koihealth-live.com/mobile/" +
                    organization.o_idx,
                }
              : undefined
          }
        />

        <section className="organizations-contents">
          <div className="flex justify-end add-btn-wrap controll-table-area">
            <AddButton
              show={userInfo && userInfo.permission === "admin"}
              onClick={() => modalOpen("new")}
              text={langFile[lang].ADD_USER_BUTTON_TEXT} // 사용자 추가하기
            />
          </div>

          <div>
            <table className="w-full table">
              <TableHead tds={tds} />
              <tbody>
                {users.map(
                  ({
                    u_idx,
                    u_id,
                    tel,
                    registdate_utc,
                    job,
                    permission,
                    u_name_eng,
                    u_name_kor,
                    u_code,
                    use_ch,
                  }) => (
                    <TableRow
                      rowDisabled={use_ch === "n"}
                      lang={lang}
                      tableRowOptionType={
                        userInfo?.permission === "admin"
                          ? use_ch === "y"
                            ? ["disabled"]
                            : ["activate"]
                          : []
                      }
                      buttonActive={userInfo && userInfo.permission === "admin"}
                      key={u_idx}
                      handleClick={() => handleTableClick(u_idx)}
                      buttonText={langFile[lang].USER_TABLE_ROW_BUTTON_TEXT} // 사용자 관리
                      onClickMenu={(type) => {
                        handleTableMenu(type, u_idx);
                      }}
                    >
                      <td>{u_code}</td>
                      <td>
                        {" "}
                        {job !== "patient"
                          ? lang === "en"
                            ? u_name_eng
                            : u_name_kor
                          : u_name_eng}
                      </td>
                      <td>
                        {permission === "admin"
                          ? langFile[lang].USER_MODAL_USER_PERMISSION1
                          : langFile[lang].USER_MODAL_USER_PERMISSION2}
                      </td>
                      <td>
                        {job &&
                          job === "doctor" &&
                          langFile[lang].USER_MODAL_USER_JOB2}
                        {/** 의사 */}
                        {job &&
                          job === "nurse" &&
                          langFile[lang].USER_MODAL_USER_JOB1}
                        {/** 간호사 */}
                        {job &&
                          job === "interpreter" &&
                          langFile[lang].USER_MODAL_USER_JOB3}
                        {/** 통역사 */}

                        {job &&
                          job === "ect" &&
                          langFile[lang].USER_MODAL_USER_JOB4}
                        {/** 기타 */}

                        {job &&
                          job === "patient" &&
                          langFile[lang].USER_MODAL_USER_JOB5}
                        {/** 환자 */}

                        {job &&
                          job === "admin" &&
                          langFile[lang].USER_MODAL_USER_JOB6}
                        {/** 관리자 */}
                      </td>
                      <td>{u_id}</td>
                      <td>{tel ? tel : "-"}</td>
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
          </div>
        </section>
      </div>
    </Layout>
  );
}

// UsersPage.getLayout = function getLayout(page: ReactElement) {
//   console.log('usePage > getLayout()');
//   return <Layout>{page}</Layout>;
// };

function getTableHeadData(lang: "ko" | "en") {
  const tds: TableHeadCol[] = [
    {
      key: langFile[lang].USER_CODE_TEXT, // 사용자번호
      valueType: "id",
      type: "text",
    },
    {
      key: langFile[lang].USER_NAME_TEXT, // 사용자명',
      valueType: "localName",
      type: "text",
    },
    {
      key: langFile[lang].USER_PERMISSION_TEXT, //권한',
      valueType: "number",
      type: "text",
    },
    {
      key: langFile[lang].USER_JOB_TEXT, //직무',
      valueType: "number",
      type: "text",
    },
    {
      key: langFile[lang].USER_EMAIL_TEXT, //이메일(ID)',
      valueType: "email",
      type: "text",
    },
    {
      key: langFile[lang].USER_TEL_TEXT, //연락처',
      valueType: "phone",
      type: "text",
    },
    {
      key: langFile[lang].USER_REGIST_DATE_TEXT, //등록일',
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

function getInfoBoxHeadData(lang: "ko" | "en") {
  const INFO_KEYS: InfoBoxType[] = [
    {
      iconType: "organization",
      title: langFile[lang].USER_ORG_NAME, // 기관명
    },
    {
      iconType: "user",
      title: langFile[lang].ORG_USER_NUMBER_TEXT, // 사용자수
    },
    {
      iconType: "patient",
      title: langFile[lang].ORG_PATIENT_NUMBER_TEXT, // 환자수
    },
    {
      iconType: "chart",
      title: langFile[lang].ORG_COMPLETED_TELECONSULTING_NUMBER_TEXT, // 완료협진수
    },
    {
      iconType: "chart",
      title: langFile[lang].ORG_COMPLETED_VISIT_NUMBER_TEXT, // 완료내원수
    },
    {
      iconType: "calendar",
      title: langFile[lang].ORG_CONTRACT_DURATION_TEXT, // 계약기간
    },
    {
      iconType: "mail",
      title: langFile[lang].ORG_CONTACT_EMAIL_TEXT, // 문의메일
    },
    {
      iconType: "qr",
      title: langFile[lang].ORG_QR_CODE_TEXT, // QR코드
    },
  ];
  return INFO_KEYS;
}

function getConfirmModalText(type: ModalType, lang: LangType) {
  let title;
  let desc;

  if (type === "activate") {
    title = langFile[lang].ACTIVATE_USER_ALERT_TITLE; // 사용자를 활성화 하시겠습니까?
    desc = langFile[lang].ACTIVATE_USER_ALERT_DESC; // 확인 버튼을 클릭하시면 사용자가 활성화됩니다.
  } //
  else if (type === "disabled") {
    title = langFile[lang].DISABLED_USER_ALERT_TITLE; // 사용자를 비활성화 하시겠습니까?
    desc = langFile[lang].DISABLED_USER_ALERT_DESC; // 확인 버튼을 클릭하시면 사용자가 비활성화됩니다.
  } else if (type === "remove") {
    title = langFile[lang].DELETE_USER_ALERT_TITLE; // 사용자를 삭제하시겠습니까?
    desc = langFile[lang].DELETE_USER_ALERT_DESC; // 삭제 버튼을 클릭하시면 사용자가 삭제됩니다.
  }
  return { title, desc };
}

function getAlertModalText(type: ModalType, lang: LangType) {
  let title;
  let desc;

  if (type === "new") {
    title = langFile[lang].ADD_USER_ALERT_TITLE; // 사용자 등록 완료
    desc = langFile[lang].ADD_USER_ALERT_DESC; // 사용자 등록이 완료되었습니다.
  } //
  else if (type === "manage") {
    title = langFile[lang].EDIT_USER_ALERT_TITLE; // 사용자 정보 수정 완료
    desc = langFile[lang].EDIT_USER_ALERT_DESC; // 사용자 정보 수정이 완료되었습니다.
  } //
  else if (type === "disabled") {
    title = langFile[lang].CP_DISABLED_USER_ALERT_TITLE; // 사용자 비활성화 완료
    desc = langFile[lang].CP_DISABLED_USER_ALERT_DESC; // 사용자 비활성화가 완료되었습니다.
  } //
  else if (type === "activate") {
    title = langFile[lang].CP_ACTIVATE_USER_ALERT_TITLE; // 사용자 활성화 완료
    desc = langFile[lang].CP_ACTIVATE_USER_ALERT_DESC; // 사용자 활성화가 완료되었습니다.
  } //
  else if (type === "remove") {
    title = langFile[lang].CP_DELETE_USER_ALERT_TITLE; // 사용자 삭제 완료
    desc = langFile[lang].CP_DELETE_USER_ALERT_DESC; // 사용자 삭제가 완료되었습니다.
  }

  return { title, desc };
}
