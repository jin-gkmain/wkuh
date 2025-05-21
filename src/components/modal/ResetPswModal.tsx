import React, { FormEvent, useContext } from 'react';
import ModalFrame from '../modal/ModalFrame';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';
import { useAppSelector } from '@/store';
import instance from '@/utils/myAxios';

type Props = {
  email: string;
  onClose: () => void;
  onComplete: (success: boolean) => void;
};

export default function ResetPswModalBox({
  onClose,
  onComplete,
  email,
}: Props) {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { lang } = useContext(LanguageContext);

  const handleSubmit = async (ev?: FormEvent) => {
    ev?.preventDefault();

    // ✨ 비밀번호 재설정 api 통신...
    // ✨ 비밀번호 재설정 api 통신...
    const target = ev.target as HTMLFormElement;
    const { email, password, rePassword } = target;
    if (password.value !== rePassword.value)
      return alert(langFile[lang].EDIT_PSW_NOT_MATCH_ALERT_TEXT); // 비밀번호가 서로 일치하지 않습니다.
    const res = await instance.post('/pwd_change', {
      u_id: email.value,
      u_pwd: password.value,
    });

    const data: MyResponse<SimpleRes> = res.data;
    if (data.result === 'OK') {
      onComplete(true);
    } else alert(langFile[lang].EDIT_PSW_FAIL_ALERT_TEXT); // 비밀번호 수정에 실패하였습니다.
  };
  return (
    <div className="reset-psw-modal">
      <ModalFrame
        onComplete={handleSubmit}
        title={langFile[lang].EDIT_PSW_MODAL_TITLE} // 비밀번호수정
        onClose={onClose}
        completeBtnText={
          lang === 'en'
            ? langFile[lang].EDIT_PSW_MODAL_COMPLETE_BUTTON_TEXT
            : ''
        }
      >
        <div className="reset-psw-modal-box flex flex-col">
          <div className="input-row-wrap">
            <section className="flex-1">
              <div className="input-col-wrap">
                <label htmlFor="email" className="label">
                  {langFile[lang].EDIT_PSW_MODAL_EMAIL_LABEL_TEXT}
                  {/**이메일(ID)*/}
                </label>
                <input
                  value={userInfo?.u_id}
                  type="text"
                  className="input"
                  disabled
                  id="email"
                  name="email"
                />
              </div>
            </section>

            <section className="flex-1 input-col-wrap">
              <div className="input-col-wrap">
                <label htmlFor="password" className="label flex">
                  {langFile[lang].EDIT_PSW_MODAL_NEW_PSW_TEXT}
                  {/* 비밀번호 */}
                  <span className="meta-info">
                    *{langFile[lang].EDIT_PSW_MODAL_PSW_CONSTRAINT_LABEL_TEXT}
                    {/* *영문과 숫자만 입력 가능합니다. */}
                  </span>
                </label>
                <input
                  type="password"
                  className="input"
                  id="password"
                  name="password"
                />
              </div>

              <div className="input-col-wrap">
                <label htmlFor="rePassword" className="label">
                  {langFile[lang].EDIT_PSW_MODAL_CHECK_PSW_LABEL_TEXT}
                  {/* 비밀번호 확인 */}
                  {lang === 'ko' && (
                    <span className="meta-info">
                      *{langFile[lang].EDIT_PSW_MODAL_PSW_CONSTRAINT_LABEL_TEXT}
                      {/* *영문과 숫자만 입력 가능합니다. */}
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  className="input"
                  id="rePassword"
                  name="rePassword"
                />
              </div>
            </section>
          </div>
        </div>
      </ModalFrame>
    </div>
  );
}
