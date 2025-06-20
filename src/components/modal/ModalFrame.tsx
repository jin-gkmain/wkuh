import React, { FormEvent, ReactNode, useContext } from "react";
import Close from "../common/icons/Close";
import langFile from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";

type Props = {
  children: ReactNode;
  title: string;
  onClose: () => void;
  onComplete?: (ev: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  width?: "small" | "basic" | "large" | "extra-large";
  hideBtns?: boolean;
  chatting?: ReactNode;
  view?: boolean;
  completeBtnText?: string;
};

export default function ModalFrame({
  children,
  title,
  onClose,
  onComplete,
  width = "basic",
  hideBtns,
  chatting,
  view,
  completeBtnText,
}: Props) {
  const { webLang } = useContext(LanguageContext);

  return (
    <div
      style={{ position: "relative" }}
      className={`modal-frame ${
        width === "extra-large"
          ? "flex modal-extra-large"
          : width === "small"
          ? "flex modal-small"
          : ""
      }`}
    >
      <form
        className="flex flex-col justify-between relative container"
        onSubmit={onComplete}
      >
        <Close
          className="close-btn"
          onClose={() => {
            onClose();
          }}
        />

        <h1 className="title">{title}</h1>
        <div
          className={`contents-box ${
            width === "extra-large" ? "content-height" : ""
          }`}
        >
          {children}
        </div>
        {!hideBtns && (
          <div className="buttons flex justify-center align-center">
            <button className="primary-btn" type="submit">
              {completeBtnText && completeBtnText}
              {!completeBtnText ? (view ? "확인" : "완료") : ""}
            </button>
            {!view && (
              <button className="basic-btn" onClick={onClose} type="button">
                {langFile[webLang].MODAL_CLOSE_BUTTON_TEXT}
                {/** 닫기 */}
              </button>
            )}
          </div>
        )}
      </form>

      {chatting && <>{chatting}</>}
    </div>
  );
}
