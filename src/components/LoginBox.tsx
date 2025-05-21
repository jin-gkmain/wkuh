import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useState,
  MutableRefObject,
} from 'react';
import Question from './common/icons/Question';
import useAlertModal from '@/hooks/useAlertModal';
import { LanguageContext } from '@/context/LanguageContext';
import langFile from '@/lang';
import Image from 'next/image';
import logoImage from '../../public/images/wkuh.logo.png';

type Props = {
  inputRef?: MutableRefObject<HTMLInputElement>;
  type: 'login' | 'findPsw' | 'reset'; // 로그인 | 비밀번호 찾기 | 비밀번호 재설정
  onSubmit: (ev: FormEvent<HTMLFormElement>) => void;
  isSentMail?: boolean;
};

export default function LoginBox({
  type,
  isSentMail,
  inputRef,
  onSubmit,
}: Props) {
  const { lang } = useContext(LanguageContext);
  const { AlertModalPortal, openAlertModal, closeAlertModal } = useAlertModal();
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;
    const { name, value } = target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  return (
    <form className="login-box relative flex flex-col" onSubmit={onSubmit}>
      <AlertModalPortal>
        <AccountInfoContactModalBox handleClick={closeAlertModal} />
      </AlertModalPortal>

      <button type="button" className="question-btn" onClick={openAlertModal}>
        <Question />
      </button>

      <h1 className="title m-auto text-center">
        <Image src={logoImage} width={261} height={55} alt="logoImage" />
      </h1>

      <h2 className="sub-title text-center">
        {
          type === 'login'
            ? langFile[lang].LOGIN_TITLE_TEXT // 원격협진 서비스 접속
            : type === 'findPsw'
            ? isSentMail
              ? langFile[lang].LOGIN_CHECK_EMAIL_TITLE_TEXT // 이메일을 확인해 주세요
              : langFile[lang].LOGIN_FIND_PSW_TITLE_TEXT // 비밀번호 찾기
            : langFile[lang].LOGIN_RESET_PSW_TITLE_TEXT // 새 비밀번호 입력
        }
      </h2>

      {type === 'findPsw' && isSentMail && (
        <p className="sent-mail-text font-bold text-center">
          <span>
            {langFile[lang].LOGIN_CHECK_EMAIL_DESC_TEXT1}{' '}
            {/** 비밀번호 재설정 메일을 */}
            <br /> {loginInfo.email}{' '}
            {langFile[lang].LOGIN_CHECK_EMAIL_DESC_TEXT2}
            {/** 으로 보냈습니다. */}
          </span>
        </p>
      )}

      <section className="inputs input-col-wrap">
        {/* type === 로그인 이거나 findPsw(메인 보내지 않음) 인 경우 */}
        {(type === 'login' || (type === 'findPsw' && !isSentMail)) && (
          <div className="input-col-wrap">
            <label htmlFor="email" className="font-bold label">
              {langFile[lang].LOGIN_EMAIL_LABLE_TEXT}
              {/** 이메일 주소 */}
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="input"
              value={loginInfo.email}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* type === 로그인 이거나 reset인 경우 */}
        {(type === 'login' || type === 'reset') && (
          <div className="input-col-wrap">
            <label htmlFor="password" className="font-bold label">
              {type === 'login'
                ? langFile[lang].LOGIN_PASSWORD_LABLE_TEXT
                : langFile[lang].LOGIN_NEW_PSW_LABEL_TEXT}
            </label>
            <input
              ref={inputRef}
              value={loginInfo.password}
              onChange={handleInputChange}
              type="password"
              name="password"
              id="password"
              className="input"
            />
          </div>
        )}
      </section>

      <div>
        <button
          className="login-btn w-full primary-btn font-semi-bold"
          type="submit"
        >
          {
            type === 'login'
              ? langFile[lang].LOGIN_BUTTON_TEXT // 로그인하기
              : type === 'findPsw'
              ? isSentMail
                ? langFile[lang].LOGIN_SEND_AGAIN_BUTTON_TEXT // 이메일 다시 보내기
                : langFile[lang].LOGIN_FIND_PSW_BUTTON_TEXT // 비밀번호 재설정 메일 발송
              : langFile[lang].LOGIN_CP_RESET_PSW_BUTTON_TEXT // 비밀번호 재설정 완료
          }
        </button>
        {type === 'login' && (
          <p className="text-center">
            <Link href={'/psw/find'} className="find-psw font-bold">
              {langFile[lang].LOGIN_FORGET_PASSWORD_TEXT}{' '}
              {/** 비밀번호를 잊으셨나요? */}
            </Link>
          </p>
        )}
        {type !== 'login' && (
          <p className="text-center">
            <Link href="/" className="find-psw font-bold">
              {langFile[lang].LOGIN_RETURN_LOGIN_TEXT}
              {/** 로그인으로 돌아가기 */}
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}

function AccountInfoContactModalBox({
  handleClick,
}: {
  handleClick: () => void;
}) {
  const { lang } = useContext(LanguageContext);

  return (
    <div className="account-info-contact-modal-box">
      <h2 className="title">{langFile[lang].ACCOUNT_CONTACT_MODAL_TITLE}</h2>

      <div className="contents">
        <div className="main-contents input-row-wrap justify-center">
          <div className="input-col-wrap">
            <span>
              {langFile[lang].ACCOUNT_CONTACT_MODAL_ORG_NAME} {/** 기관명 */}
            </span>
            <span>
              {langFile[lang].ACCOUNT_CONTACT_MODAL_EMAIL} {/** 문의메일 */}
            </span>
            <span>
              {langFile[lang].ACCOUNT_CONTACT_MODAL_TEL} {/** 연락처 */}
            </span>
          </div>

          <div className="input-col-wrap">
            <span>
              {langFile[lang].ACCOUNT_CONTACT_MODAL_ORG_NAME_VALUE}
              {/** 원광대병원 */}
            </span>
            <span>contact@wmcsb.co.kr</span>
            <span>+82 63-859-1115</span>
          </div>
        </div>

        <p>
          {langFile[lang].ACCOUNT_CONTACT_MODAL_DESC}
          {/** 계정 문의 혹은 문제가 있을시 위 문의처로 연락주시기 바랍니다. */}
        </p>
      </div>

      <button className="primary-btn" type="button" onClick={handleClick}>
        ok
      </button>
    </div>
  );
}
