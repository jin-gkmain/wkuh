import { LangType } from "@/context/LanguageContext";
import { Gubun } from "@/store/modules/workflowModalSlice";
import { AlertStatus } from "@/types/alert";
import langFile from "@/lang";

function getSystemAlertText(lang: LangType, tab: Gubun, type: AlertStatus) {
  let str = ` ${langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_TEXT1} `;

  if (type === "create") {
    str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_CREATE_WF; // 님이 워크플로우를 생성했어요.
    return str;
  }

  if (type === "regist") {
    switch (tab) {
      case "pa": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_RQ_PI; // 님이 환자정보를 확인을 요청했어요.
        break;
      }
      case "op": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_RQ_OP; // 님이 소견서 확인을 요청했어요.
        break;
      }
      case "te": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_RQ_TT; // 님이 협진 스케쥴링을 요청했어요.
        break;
      }
      case "ca": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_RQ_CP; // 님이 치료계획서 확인을 요청했어요.
        break;
      }
      case "vif": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_RQ_VF; // 님이 내원준비 확인을 요청했어요.
        break;
      }
      case "vii": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_RQ_VI; // 님이 내원상담 확인을 요청했어요.
        break;
      }
      case "vir": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_RQ_VR; // 님이 내원결과 확인을 요청했어요.
        break;
      }
      case "poc": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_RQ_PC; // 님이 사후상담 확인을 요청했어요.
        break;
      }
      case "pp": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_RQ_PP; // 님이 사후처방 확인을 요청했어요.
        break;
      }
      case "chat": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_POST_CHAT; // 님이 채팅을 작성했어요.
      }
    }
  } //
  else if (type === "save") {
    switch (tab) {
      case "pa": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_SAVE_PI; // 님이 환자정보를 저장했어요.
        break;
      }
      case "op": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_SAVE_OP; // 님이 소견서정보를 저장했어요.
        break;
      }
      case "te": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_SAVE_TT; // 님이 원격협진 일정을 등록했어요.
        break;
      }
      case "ca": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_SAVE_CP; // 님이 치료계획서를 저장했어요.
        break;
      }
      case "vif": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_SAVE_VF; // 님이 내원준비를 저장했어요.
        break;
      }
      case "vii": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_SAVE_VI; // 님이 내원상담을 저장했어요.
        break;
      }
      case "vir": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_SAVE_VR; // 님이 내원결과를 저장했어요.
        break;
      }
      case "poc": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_SAVE_PC; // 님이 사후상담을 저장했어요.
        break;
      }
      case "pp": {
        str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_SAVE_PP; // 님이 사후처방을 등록했어요.
        break;
      }
    }
  } else if (type === "complete") {
    str += langFile[lang].WORKFLOW_MODAL_CHATTING_ALARM_COMPLETE_PP; // 님이 사후처방 완료 처리했어요.
  }

  return str;
}

export { getSystemAlertText };
