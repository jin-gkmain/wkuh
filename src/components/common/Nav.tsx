import React, { useContext, useRef, useState, useEffect } from "react";
import Image from "next/image";
import User from "./icons/User";
import Global from "./icons/Global";
import ArrowDown from "./icons/ArrowDown";
import DropdownOptions from "./DropdownOptions";
import useModal from "@/hooks/useModal";
import ResetPswModal from "../modal/ResetPswModal";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import useAlertModal from "@/hooks/useAlertModal";
import CheckAlertbox from "./CheckAlertBox";
import langFile from "@/lang";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/store";
import { userActions } from "@/store/modules/userSlice";
import { removeTokens } from "@/utils/tokens";
import ConfirmAlertBox from "./ConfirmAlertBox";
import LogoImage from "../../../public/images/wkuh.logo.png";

type UserSettingOptions = "password" | "logout";

function getUserSettingOptions(lang: "ko" | "en") {
  const userSettingOptions: DropdownOption<UserSettingOptions>[] = [
    {
      text: langFile[lang].DROP_EDIT_PSW_TEXT, // 비밀번호수정
      type: "password",
      allowed: true,
    },
    {
      text: langFile[lang].DROP_LOGOUT_TEXT, // 로그아웃
      type: "logout",
      allowed: true,
    },
  ];
  return userSettingOptions;
}

const langDropdownOptions: DropdownOption<LangType>[] = [
  {
    text: "English",
    type: "en",
    allowed: true,
  },
  {
    text: "한국어",
    type: "ko",
    allowed: true,
  },
];

export default function Nav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { lang, setLang } = useContext(LanguageContext);
  const userSettingOptions = getUserSettingOptions(lang as "ko" | "en");
  const [profileOpened, setProfileOpened] = useState(false);
  const [langOpened, setLangOpened] = useState(false);
  const { ModalPortal, closeModal, openModal } = useModal();
  const dropdownRef = useRef<null | HTMLElement>(null);
  const langDropRef = useRef<null | HTMLElement>(null);

  const { AlertModalPortal, closeAlertModal, openAlertModal } = useAlertModal();
  const {
    AlertModalPortal: LogoutAlertModal,
    closeAlertModal: closeLogoutModal,
    openAlertModal: openLogoutAlertModal,
  } = useAlertModal();

  const signOut = () => {
    // ✨ token 정보 삭제 후 login page로 이동
    dispatch(userActions.removeUser());
    removeTokens();
    router.push("/");
  };

  const onComplete = (success: boolean) => {
    closeModal();
    openAlertModal();
  };

  const closeDrop = () => {
    setProfileOpened(false);
  };

  // 프로필 dropdown 선택 후 실행
  const handleProfileDropdown = (type: UserSettingOptions) => {
    if (type === "password") {
      openModal();
    } else if (type === "logout") {
      openLogoutAlertModal();
    }
  };

  // 언어 설정
  const handleLangDropdown = (type: LangType | "en" | "ko") => {
    setLang(type);
    setLangOpened(false);
  };

  return (
    <header className="nav-container">
      {/* 비밀번호 수정 모달 */}
      <ModalPortal>
        <ResetPswModal onClose={closeModal} onComplete={onComplete} email="" />
      </ModalPortal>

      {/* 비밀번호 수정 완료 알림 모달 */}
      <AlertModalPortal>
        <CheckAlertbox
          handleClose={closeAlertModal}
          title={langFile[lang].EDIT_PSW_ALERT_TITLE} // 비밀번호 수정 완료
          desc={langFile[lang].EDIT_PSW_ALERT_DESC} // 비밀번호 수정이 완료되었습니다
        />
      </AlertModalPortal>

      <LogoutAlertModal>
        <ConfirmAlertBox
          handleMainClick={signOut}
          handleClose={closeLogoutModal}
          iconType="logout"
          title={langFile[lang].LOGOUT_ALERT_MODAL_TITLE_TEXT} // 로그아웃
          desc={langFile[lang].LOGOUT_ALERT_MODAL_TITLE_DESC} // 로그아웃 하시겠습니까?
        />
      </LogoutAlertModal>

      <nav className="flex">
        <div>
          <Image
            priority
            src={LogoImage}
            alt="logoImage"
            width={200}
            height={42}
          />
        </div>

        <div className="flex align-center gap-20">
          <section ref={langDropRef} className="relative lang-dropdown-wrap">
            <Global
              className="global"
              handleClick={() => {
                setLangOpened(!langOpened);
              }}
            />
            {langOpened && (
              <DropdownOptions<LangType | "en" | "ko">
                options={langDropdownOptions}
                dropRef={langDropRef}
                onClose={() => setLangOpened(false)}
                onClick={handleLangDropdown}
              />
            )}
          </section>

          <section
            ref={dropdownRef}
            id="dropdownMenu"
            className="profile flex align-center gap-10"
            onClick={() => {
              setProfileOpened(!profileOpened);
            }}
          >
            <User roundBg={true} />
            <div className="flex align-center gap-5">
              <span>
                {langFile[lang].NAV_PROFILE_DROP_TEXT}
                {/* 프로필 */}
              </span>
              <ArrowDown />
            </div>

            {profileOpened && (
              <DropdownOptions<UserSettingOptions>
                onClose={closeDrop}
                options={userSettingOptions}
                dropRef={dropdownRef}
                onClick={handleProfileDropdown}
              />
            )}
          </section>
        </div>
      </nav>
    </header>
  );
}
