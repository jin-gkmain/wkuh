import React, { FormEvent } from 'react';
import LoginBox from '@/components/LoginBox';
import useAlertModal from '@/hooks/useAlertModal';
import CheckAlertbox from '@/components/common/CheckAlertBox';

export default function ResetPswPage() {
  const { AlertModalPortal, closeAlertModal, openAlertModal } = useAlertModal();

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();

    const target = ev.target as HTMLFormElement;

    if (target && target.password) {
      // ✨비밀번호 재설정 api 통신...
      // 성공시, alertModal을 띄운다.
      openAlertModal();
    }
  };

  return (
    <div className="reset-page flex flex-center">
      <LoginBox onSubmit={onSubmit} type="reset" />

      <AlertModalPortal>
        <CheckAlertbox
          handleClose={closeAlertModal}
          title="비밀번호 재설정 완료"
          desc="비밀번호 재설정이 완료되었습니다."
        />
      </AlertModalPortal>
    </div>
  );
}
