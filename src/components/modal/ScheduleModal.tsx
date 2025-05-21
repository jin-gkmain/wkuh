import React, { MouseEvent, useContext, useEffect, useState } from 'react';
import ModalFrame from './ModalFrame';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  EventClickArg,
  EventContentArg,
  EventInput,
} from '@fullcalendar/core/index.js';
import { TeleconsultingModalContext } from '@/context/TeleconsultingContext';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';
import getAppointmentList from '@/data/appointment';
import { workflowModalActions } from '@/store/modules/workflowModalSlice';
import { useAppDispatch } from '@/store';
import { WorkflowModalContext } from '@/context/WorkflowModalContext';
import { convertTimeToStr, getDayDiff } from '@/utils/date';

type TabType = 'te' | 'vii';

type Props = {
  country: string;
  o_idx: string;
  closeModal: () => void;
};

export default function ScheduleModal({ closeModal, o_idx, country }: Props) {
  const { openModal: openWorkflowModal } = useContext(WorkflowModalContext);
  const { lang } = useContext(LanguageContext);
  const { openModal: openTeleModal, closeModal: closeTeleModal } = useContext(
    TeleconsultingModalContext
  );
  const [tab, setTab] = useState<TabType>('te');
  const [events, setEvents] = useState<EventInput[] | null>(null);

  const dispatch = useAppDispatch();

  const handleTab = (ev: MouseEvent<HTMLElement>) => {
    const target = ev.target;
    if (!(target instanceof HTMLLIElement)) return;
    const tab = target.dataset.tab as TabType;
    setTab(tab);
  };

  const handleEventClick = (info?: EventClickArg) => {
    const event = info.event;
    const { extendedProps } = event;

    if (extendedProps.gubun === 'te') {
      let diff = getDayDiff(
        event.start.toISOString(),
        new Date().toISOString(),
        country,
        true
      );

      if (diff >= 1)
        return alert(langFile[lang].CALENDAR_ENDED_MEETING_ALERT_TEXT);
      // 이미 종료된 회의 입니다.
      else window.open(extendedProps.te_link, '_blank');
    } else if (extendedProps.gubun === 'vii') {
      dispatch(
        workflowModalActions.setDefaultInfoWithGubun({
          gubun: extendedProps.gubun,
          p_idx: extendedProps.p_idx,
          w_idx: extendedProps.w_idx,
        })
      );
      openWorkflowModal();
    }
  };

  useEffect(() => {
    console.log('tab>', tab);
    const fetchApts = async () => {
      const res = await getAppointmentList(parseInt(o_idx));

      if (res !== 'ServerError') {
        let data; 
        if (res) {
          if (tab === 'te') {
            data = res
              .filter((w) => w.te_date)
              .map((i) => ({
                title: i.p_name_eng,
                start: convertTimeToStr(country, i.te_date.toString(), null, 'YYYY-MM-DDThh:mm:ss'),
                te_link: i.te_link,
                gubun: 'te',
              }));
          } else {
            data = res
              .filter((w) => w.vii_tad)
              .map((i) => ({
                title: i.p_name_eng,
                start: convertTimeToStr(country, i.vii_tad.toString(), null ,'YYYY-MM-DDThh:mm:ss'),  
                p_idx: i.p_idx,
                w_idx: i.w_idx,
                gubun: 'vii',
              })); 
          }

          setEvents(data);
        }
      }
    };

    fetchApts();
  }, [tab]);

  return (
    <div className="schedule-modal w-full flex justify-center">
      <ModalFrame
        hideBtns={true}
        onClose={closeModal}
        title={langFile[lang].CALENDAR_MODAL_TITLE_TEXT} // 캘린더 보기
        width="extra-large"
        onComplete={() => {}}
      >
        <div>
          <ul className="flex gap-10 tabs" onClick={handleTab}>
            <li data-tab="te" className={tab === 'te' ? 'selected' : ''}>
              {langFile[lang].CALENDAR_TAB_TELE_TEXT}
              {/** 원격협진 */}
            </li>
            <li data-tab="vii" className={tab === 'vii' ? 'selected' : ''}>
              {langFile[lang].CALENDAR_TAB_VISIT_TEXT}
              {/** 내원진료 */}
            </li>
          </ul>
          <FullCalendar
            eventClick={handleEventClick}
            contentHeight={50}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next',
            }}
            titleFormat={{ month: 'long' }}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventContent={renderEventContent}
          />
        </div>
      </ModalFrame>
    </div>
  );
}

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
