import { Gubun } from '@/store/modules/workflowModalSlice';
import { AlertStatus } from '@/types/alert';

export default function AlertIcon({
  tab,
  type,
}: {
  tab: Gubun;
  type: AlertStatus;
}) {
  let url;
  let alt;

  switch (type) {
    case 'create': {
      url = '/images/chatting_create_workflow.png';
      alt = 'documentImage';
      break;
    }
    case 'regist': {
      if (tab === 'chat') {
        url = '/images/chatting_chat.png';
        alt = 'chattingImage';
        break;
      } else {
        url = '/images/chatting_request_confirm.png';
        alt = 'confirmImage';
        break;
      }
    }
    case 'save': {
      if (tab === 'te') {
        url = '/images/chatting_calendar.png';
        alt = 'calendarImage';
        break;
      } else {
        url = '/images/chatting_save_workflow.png';
        alt = 'saveImage';
        break;
      }
    }
    case 'complete': {
      url = '/images/chatting_complete.png';
      alt = 'checkImage';
      break;
    }
  }

  return (
    <span className="chatting-icon-round">
      <img src={url} alt={alt} />
    </span>
  );
}
