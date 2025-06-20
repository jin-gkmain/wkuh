import React, { useContext } from "react";
import Trash from "./icons/Trash";
import Download from "./icons/Download";
import Send from "./icons/Send";
import Check from "./icons/Check";
import langFile from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";

type Props = {
  iconType?: ModalType | "logout";
  title?: string;
  desc?: string;
  handleMainClick?: () => void;
  handleClose: () => void;
};

export default function ConfirmAlertBox({
  title,
  desc,
  iconType,
  handleClose,
  handleMainClick,
}: Props) {
  const { lang, webLang } = useContext(LanguageContext);
  return (
    <div className="confirm-alert-box text-center flex flex-col align-center">
      {iconType === "disabled" && <Trash />}
      {iconType === "activate" && <Trash />}
      {iconType === "remove" && <Trash />}
      {iconType === "download" && <Download />}
      {(iconType === "confirm" || iconType === "logout") && <Send />}
      {iconType === "completed" && <Check />}

      <div className="text-content">
        <h2>{title}</h2>

        <p>{desc}</p>
      </div>

      <div className="buttons flex gap-20 w-full">
        <button className="primary-btn fex-1" onClick={handleMainClick}>
          {iconType === "disabled" &&
            langFile[webLang].MODAL_DISABLED_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === "activate" &&
            langFile[webLang].MODAL_ACTIVATE_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === "remove" && langFile[webLang].MODAL_DELETE_BUTTON_TEXT}
          {/* 삭제 */}

          {iconType === "confirm" &&
            langFile[webLang].MODAL_CONFIRM_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === "completed" &&
            langFile[webLang].MODAL_COMPLETE_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === "download" &&
            langFile[webLang].MODAL_DOWNLOAD_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === "logout" && langFile[webLang].MODAL_LOGOUT_BUTTON_TEXT}
          {/* 확인 */}
        </button>
        <button className="basic-btn flex-1" onClick={handleClose}>
          {langFile[webLang].MODAL_CANCEL_BUTTON_TEXT}
          {/* 취소 */}
        </button>
      </div>
    </div>
  );
}
