import React, {
  ChangeEvent,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';

type Props = {
  disabled?: boolean;
  children?: ReactNode;
  alert: boolean;
  alertType: 'success' | 'fail';
  alertText?: string;
  checkDuplicate: () => Promise<void>;
  name: string;
  handleInputChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export default function CheckDuplicateInput({
  disabled = false,
  children,
  alert,
  alertType,
  alertText,
  checkDuplicate,
  name,
  handleInputChange,
  value,
}: Props) {
  const { lang } = useContext(LanguageContext);

  return (
    <div
      className={`check-duplicate-input relative input ${
        alert
          ? alertType === 'success'
            ? 'success-border-color'
            : 'alert-border-color'
          : ''
      } ${disabled ? 'input-disabled' : ''}`}
    >
      <input
        disabled={disabled}
        autoComplete="off"
        name={name}
        id={name}
        type="text"
        // className={`w-full ${
        //   alert ? (alertType === 'success' ? 'success' : 'fail') : ''
        // }`}
        className="w-full"
        onChange={handleInputChange}
        value={value || ''}
      />
      {alert && alertText && (
        <span
          className={`shrink-0 ${alertType === 'success' ? 'success' : 'fail'}`}
        >
          {alertText}
        </span>
      )}

      {children}

      <button
        disabled={disabled}
        type="button"
        onClick={checkDuplicate}
        className="h-full shrink-0"
      >
        {langFile[lang].PATIENT_CHECK_DUPLICATED_OR_NOT_BUTTON}
        {/* 중복검사 */}
      </button>
    </div>
  );
}
