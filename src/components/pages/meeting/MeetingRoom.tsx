import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import PatientView from '@/components/modal/WorkflowModal';
import { MeetingInfo } from '@/pages/meeting/[id]';
import dayjs from 'dayjs';
import registAlert, { getAlertList } from '@/data/alert';
import ArrowRightLine from '@/components/common/icons/ArrowRightLine';
import ArrowLeftLine from '@/components/common/icons/ArrowLeftLine';

type Poprs = {
  meetingInfo: MeetingInfo | null;
  name: string;
  userInfo: StoredUser | null;
  chartInfo: DiagnosisModal | null;
  patientInfo: Patient | null;
};

const WherebyMeeting = dynamic(
  () => import('@/components/pages/meeting/WherebyMeeting'),
  { ssr: false }
);

export default function MeetingRoom({
  name,
  userInfo,
  meetingInfo,

  chartInfo,
  patientInfo,
}: Poprs) {
  const [err, setErr] = useState(false);
  const [patientViewOpened, setPatientViewOpened] = useState(true);

  const handleLeave = async () => {
    if (!userInfo || !chartInfo || !patientInfo) return;

    let alert = false;
    let time = false;

    const alertList = await getAlertList(chartInfo.w_idx, 'status');

    if (alertList !== 'ServerError') {
      if (alertList) {
        if (
          !alertList.find((i) => i.gubun === 'te' && i.status === 'complete')
        ) {
          alert = true;
        }
      } else {
        alert = true;
      }
    }

    let local =
      userInfo.country === 'korea' ? 'Asia/Seoul' : 'Asia/Ulaanbaatar';

    const now = dayjs(new Date().toISOString()).tz(local);
    const start_date = dayjs(chartInfo.te_date).tz(local);

    if (now.isAfter(start_date)) {
      time = true;
    } else {
    }

    if (alert && time) {
      const res = await registAlert(chartInfo.w_idx, 'te', 'complete');
    }
  };

  if (err) return <p>The meeting does not exist or has already ended.</p>;

  if (!meetingInfo || !meetingInfo.hostRoomUrl)
    return (
      <div className="modal-container">
        <div className="modal-background flex align-center">
          <div className="spinner"></div>
        </div>
      </div>
    );
  else
    return (
      <>
        <div className="teleconsulting-area">
          {patientInfo && chartInfo && (
            <div
              className={`patient-info-area ${patientViewOpened ? '' : 'hide'}`}
            >
              <PatientView
                lang="en"
                org={null}
                chartInfo={chartInfo}
                patientInfo={patientInfo}
                userInfo={userInfo}
                view
              />
            </div>
          )}

          {meetingInfo && (
            <div
              className={`meeting-area relative ${
                !patientInfo || !chartInfo || !patientViewOpened
                  ? 'full-view'
                  : ''
              }`}
            >
              <button
                className="sidebar-controller"
                onClick={() => {
                  setPatientViewOpened(!patientViewOpened);
                }}
              >
                {patientViewOpened && chartInfo && patientInfo ? (
                  <ArrowLeftLine />
                ) : (
                  <ArrowRightLine />
                )}
              </button>

              <WherebyMeeting
                onLeave={handleLeave}
                roomUrl={meetingInfo.hostRoomUrl + '&logo=off'}
                userName={name}
                meetingId={meetingInfo.meetingId}
              />
            </div>
          )}
        </div>
      </>
    );
}
