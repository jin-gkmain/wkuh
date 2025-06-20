import React, { FormEvent, useState, useContext } from "react";
import LoginBox from "@/components/LoginBox";
import instance from "@/utils/myAxios";
import langFile from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";

export default function FindPswPage() {
  const { webLang } = useContext(LanguageContext);
  const [isSentMail, setIsSendMail] = useState(false);

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const target = ev.target as HTMLFormElement;
    if (target && target.email) {
      const target = ev.target as HTMLFormElement;

      // ✨ 해당 이메일로 비밀번호 재설정 메일 보내는 api 통신...
      const res = await instance.post("/pwd_find", {
        email: target.email.value,
      });
      const data: MyResponse<"SUCCESS" | "ERROR"> = res.data;

      if (data.result === "SUCCESS") {
        setIsSendMail(true);
      } else {
        alert(langFile[webLang].FIND_PSW_FAIL_ALERT_TEXT); // 이메일을 확인해주세요.이메일을 확인해주세요.
      }
    }
  };

  return (
    <div className="login-page flex flex-center">
      <LoginBox onSubmit={onSubmit} type="findPsw" isSentMail={isSentMail} />
    </div>
  );
}
