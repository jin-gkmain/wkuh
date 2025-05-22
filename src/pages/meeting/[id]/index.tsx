import MeetingRoom from '@/components/pages/meeting/MeetingRoom';
import { LanguageContext } from '@/context/LanguageContext';
import getPatients, { getPatient } from '@/data/patient';
import { getWorkflow } from '@/data/workflow';
import useMe from '@/hooks/useMe';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useContext } from 'react';
import langFile from '@/lang';
import SendbirdMeetingRoom from '@/components/pages/meeting/sendbirdtest/SendbirdMeetingRoom';

export type MeetingInfo = {
  startDate: string;
  endDate: string;
  roomName: string;
  roomUrl: string;
  meetingId: string;
  hostRoomUrl: string;
  viewerRoomUrl: string;
};

export default function MeetingPage() {
  const { lang } = useContext(LanguageContext);
  const { userInfo, loading } = useMe();
  const [userName, setUserName] = useState('');
  const [meetingDate, setMeetingDate] = useState({
    startDate: '',
    endDate: '',
  });
  const [meetingId, setMeetingId] = useState('');
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | null>(null);

  const [chartInfo, setChartInfo] = useState<Diagnosis | null>(null);
  const [patientInfo, setPatientInfo] = useState<Patient | null>();

  const router = useRouter();

  const fetchMeetingInfo = async (meetingId: string) => {
    const response = await fetch(`/api/meeting/${meetingId}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (response.ok) {
      return data as MeetingInfo;
    } else {
      return null;
    }
  };

  const handleForm = async (ev) => {
    ev.preventDefault();
    const name = ev.target.name;
    const m = await fetchMeetingInfo(router.query.id as string);
    if (m) {
      setMeetingInfo(m);
      setUserName(name.value);
    } else {
      alert(
        langFile[lang].MEETING_ALERT_FAIL_FETCH_MEETING_INFO
        // '회의 정보를 찾을 수 없습니다.\n이 창을 닫고 나중에 다시 접속해 주시기 바랍니다.'
      );
    }
  };

  useEffect(() => {
    if (userInfo) {
      const meetingId = router.query.id as string;
      const p_idx = router.query.p as string;
      const w_idx = router.query.w as string;

      if (p_idx && w_idx) {
        const fetchData = async () => {
          let pass = true;
          if (userInfo.country === 'korea') {
            console.log('로그인ok > korea');
            const data = await getPatient(parseInt(p_idx));
            if (data !== 'ServerError' && data) {
              setPatientInfo(data);
            } else {
              console.log('환자정보 가져오기 실패');
              pass = false;
            }
          } //
          else {
            console.log('로그인ok > mongol');
            const data = await getPatients(userInfo.o_idx, {
              search: 'p_idx',
              search_key: p_idx,
            });

            if (data !== 'ServerError' && data.length) {
              setPatientInfo(data[0]);
            } else {
              console.log('환자정보 가져오기 실패');
              pass = false;
            }
          }

          // 환자정보 가져오기 성공인 경우
          if (pass) {
            const w = await getWorkflow(parseInt(w_idx));
            if (w !== 'ServerError' && w) {
              setChartInfo(w);
            } else {
              console.log('진료정보 가져오기 실패');
              pass = false;
            }
          } //
          // 환자정보 가져오기 실패인 경우
          else {
            return alert(
              langFile[lang].MEETING_ALERT_FAIL_FETCH_PATIENT_INFO
              // '환자 정보를 찾을 수 없습니다.\n이 창을 닫고 다시 접속해 주시기 바랍니다.'
            );
          }

          // 진료정보 가져오기 성공인 경우
          if (pass) {
            const m = await fetchMeetingInfo(meetingId);
            if (m) {
              setMeetingInfo(m);
              setUserName(userInfo.u_name_eng);
            } else {
              console.log('회의정보 가져오기 실패');
              pass = false;
            }
          } //
          // 진료정보 가져오기 실패인 경우
          else {
            return alert(
              langFile[lang].MEETING_ALERT_FAIL_FETCH_WORKFLOW_INFO
              // '진료 정보를 찾을 수 없습니다.\n이 창을 닫고 나중에 다시 접속해 주시기 바랍니다.'
            );
          }

          if (!pass) {
            return alert(
              langFile[lang].MEETING_ALERT_FAIL_FETCH_MEETING_INFO
              // '회의 정보를 찾을 수 없습니다.\n이 창을 닫고 나중에 다시 접속해 주시기 바랍니다.'
            );
          }
        };

        fetchData();
      }
    }
  }, [userInfo, router.query]);

  if (loading !== 'completed') return null;
  else {
    if (!userInfo && !userName) {
      return (
        <>
          <div className="name-form-bg">
            <form onSubmit={handleForm} className="name-form">
              <h3>
                {langFile[lang].MEETING_NAME_FORM_TITLE_TEXT}
                {/* To join the meeting, please enter your name. */}
              </h3>
              <div className="name-content">
                <input autoComplete="off" type="text" id="name" />
                <button type="submit">
                  {langFile[lang].MEETING_NAME_FORM_JOIN_BTN_TEXT}
                  {/* join */}
                </button>
              </div>
            </form>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="meeting-page">
            <MeetingRoom
              meetingInfo={meetingInfo}
              // meetingId={meetingId}
              name={userName}
              userInfo={userInfo}
              chartInfo={chartInfo}
              patientInfo={patientInfo}
            />
          </div>
        </>
      );
    }
  }
}
