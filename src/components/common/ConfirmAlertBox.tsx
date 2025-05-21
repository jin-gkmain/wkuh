import React, { useContext } from 'react';
import Trash from './icons/Trash';
import Download from './icons/Download';
import Send from './icons/Send';
import Check from './icons/Check';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';

type Props = {
  iconType?: ModalType | 'logout';
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
  const { lang } = useContext(LanguageContext);
  return (
    <div className="confirm-alert-box text-center flex flex-col align-center">
      {iconType === 'disabled' && <Trash />}
      {iconType === 'activate' && <Trash />}
      {iconType === 'remove' && <Trash />}
      {iconType === 'download' && <Download />}
      {(iconType === 'confirm' || iconType === 'logout') && <Send />}
      {iconType === 'completed' && <Check />}

      <div className="text-content">
        <h2>{title}</h2>

        <p>{desc}</p>
      </div>

      <div className="buttons flex gap-20 w-full">
        <button className="primary-btn fex-1" onClick={handleMainClick}>
          {iconType === 'disabled' && langFile[lang].MODAL_DISABLED_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === 'activate' && langFile[lang].MODAL_ACTIVATE_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === 'remove' && langFile[lang].MODAL_DELETE_BUTTON_TEXT}
          {/* 삭제 */}

          {iconType === 'confirm' && langFile[lang].MODAL_CONFIRM_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === 'completed' &&
            langFile[lang].MODAL_COMPLETE_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === 'download' && langFile[lang].MODAL_DOWNLOAD_BUTTON_TEXT}
          {/* 확인 */}

          {iconType === 'logout' && langFile[lang].MODAL_LOGOUT_BUTTON_TEXT}
          {/* 확인 */}
        </button>
        <button className="basic-btn flex-1" onClick={handleClose}>
          {langFile[lang].MODAL_CANCEL_BUTTON_TEXT}
          {/* 취소 */}
        </button>
      </div>
    </div>
  );
}
