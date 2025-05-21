import { ChartIdDuplicated } from '@/components/modal/PatientModalBox';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';
import { AxiosResponse } from 'axios';

type Props = {
  type: 'duplicate' | 'create';
  value: string;
  buttonText: string;
  labelText?: string;
  disabled?: boolean;
  inputId?: string;
  alert?: boolean;
  success?: boolean;
  initChartIdState?: () => void;
  handleChange?: (ev: ChangeEvent<HTMLInputElement>) => void;
  onComplete?: (status?: ChartIdDuplicated) => void;
  check?: () => Promise<AxiosResponse<{ result: 'USABLE' | 'DUPLICATE' }>>;
  alertType: ChartIdDuplicated;
  alertBlink?: string;
};

function ActionInput({
  alert,
  success,
  type,
  value,
  disabled = false,
  buttonText,
  labelText,
  alertType,
  inputId,
  initChartIdState,
  handleChange,
  onComplete,
  check,
  alertBlink,
}: Props) {
  const { lang } = useContext(LanguageContext);
  const [text, setText] = useState('');

  const handleOnClick = async () => {
    if (type === 'duplicate') {
      if (value.length !== 8) {
        onComplete && onComplete('length');
        return;
      }
      // ✨ 환자 일련번호 중복확인 api 통신...
      let success = true;
      try {
        const res = await check();
        const data = res.data;
        if (data.result === 'USABLE') {
          success = true;
        } else success = false;
      } catch (err) {
        success = false;
      }
      if (success) {
        setText(langFile[lang].PATIENT_SERIAL_NUMBER_AVAILABLE_TEXT); // *일련번호 사용이 가능합니다.
        onComplete && onComplete('success');
      } else {
        setText(langFile[lang].PATIENT_SERIAL_NUMBER_DUPLICATED_TEXT); // *중복되는 일련번호 입니다.
        onComplete && onComplete('fail');
      }
    } //
    else if (type === 'create') {
      onComplete && onComplete();
    }
  };

  useEffect(() => {
    if (type === 'duplicate') {
      if (alertType === 'fail') {
        setText(langFile[lang].PATIENT_SERIAL_NUMBER_DUPLICATED_TEXT); // *중복되는 일련번호 입니다.
      } else if (alertType === 'success') {
        setText(langFile[lang].PATIENT_SERIAL_NUMBER_AVAILABLE_TEXT); // *일련번호 사용이 가능합니다.
      } else if (alertType === 'length') {
        setText('8자리 형식을 맞춰주세요.'); // *8자리 형식을 맞춰주세요.
      } else if (alertType === 'notCheck') {
        setText(langFile[lang].PATIENT_PERFORM_DUPLICATE_CHECK_TEXT); // *중복검사를 완료해주세요
      }
    } //
    else if (type === 'create') {
      if (alertType === 'fail') {
        setText(langFile[lang].PATIENT_SERIAL_NUMBER_FIRST_TEXT); // *환자 일련번호를 먼저 등록해주세요
      } else if (alertType === 'modify') {
        setText(langFile[lang].EDIT_PATIENT_ACCOUNT_TEXT); // *일련번호에 따라 계정이 수정되었습니다. 환자에게도 알려주세요
      } else if (alertType === 'ready') {
        setText('');
      }
    }
  }, [alertType, type, lang]);

  return (
    <>
      {/* <div
        className={`action-input input relative ${
          disabled ? 'input-disabled' : ''
        }`}
      > */}
      <div className={`action-input input relative`}>
        {type === 'duplicate' && (
          <input
            id={inputId}
            name={inputId}
            className="flex-1"
            placeholder={labelText}
            value={value}
            onChange={(ev) => {
              initChartIdState && initChartIdState();
              handleChange && handleChange(ev);
            }}
          />
        )}

        {type === 'create' && (
          <span className="input-disabled flex-1 h-full success-text flex align-center created">
            {value ? `ID: ${value}` : ''}
          </span>
        )}

        {type === 'create' &&
          (alertType === 'fail' || alertType === 'modify') && (
            <span
              className={`alert-text ${
                alertType === 'modify' ? 'success-text' : 'fail-text'
              } ${alertBlink}`}
            >
              {text}
            </span>
          )}

        {type === 'duplicate' &&
          (alertType === 'fail' ||
            alertType === 'length' ||
            alertType === 'notCheck' ||
            alertType === 'success') && (
            <span
              className={`alert-text ${
                alertType === 'success' ? 'success-text' : 'fail-text'
              } ${alertBlink}`}
            >
              {text}
            </span>
          )}

        <button
          className="font-bold"
          disabled={disabled}
          type="button"
          onClick={handleOnClick}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

export default React.memo(ActionInput);
