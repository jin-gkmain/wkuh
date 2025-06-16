import React, { useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PatientView } from "@/components/modal/WorkflowModalTabs/PatientView";
import { MeetingInfo } from "@/pages/meeting/[id]";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import registAlert, { getAlertList } from "@/data/alert";
import ArrowRightLine from "@/components/common/icons/ArrowRightLine";
import ArrowLeftLine from "@/components/common/icons/ArrowLeftLine";
import { LanguageContext } from "@/context/LanguageContext";
import { WorkflowTabType } from "@/store/modules/workflowModalSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

type Poprs = {
  meetingInfo: MeetingInfo | null;
  name: string;
  userInfo: StoredUser | null;
  chartInfo: DiagnosisModal | null;
  patientInfo: Patient | null;
};

const WherebyMeeting = dynamic(
  () => import("@/components/pages/meeting/WherebyMeeting"),
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
  const { lang, setLang } = useContext(LanguageContext);

  // 디버깅을 위한 로그
  console.log("MeetingRoom render - patientInfo:", !!patientInfo, "chartInfo:", !!chartInfo);

  useEffect(() => {
    console.log("patientViewOpened changed:", patientViewOpened);
    console.log("patientInfo exists:", !!patientInfo);
    console.log("chartInfo exists:", !!chartInfo);
  }, [patientViewOpened, patientInfo, chartInfo]);

  const handleLeave = async () => {
    if (!userInfo || !chartInfo || !patientInfo) return;

    let alert = false;
    let time = false;

    const alertList = await getAlertList(chartInfo.w_idx, "status");

    if (alertList !== "ServerError") {
      if (alertList) {
        if (
          !alertList.find((i) => i.gubun === "te" && i.status === "complete")
        ) {
          alert = true;
        }
      } else {
        alert = true;
      }
    }

    let local =
      userInfo.country === "korea" ? "Asia/Seoul" : "Asia/Ulaanbaatar";

    const now = dayjs(new Date().toISOString()).tz(local);
    const start_date = dayjs(chartInfo.te_date).tz(local);

    if (now.isAfter(start_date)) {
      time = true;
    } else {
    }

    if (alert && time) {
      const res = await registAlert(chartInfo.w_idx, "te", "complete");
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
              className={`patient-info-area ${patientViewOpened ? "opened" : "closed"}`}
            >
              <PatientView
                org={null}
                chartInfo={chartInfo}
                patientInfo={patientInfo}
                lang={lang}
                userInfo={userInfo}
                patient={!!(userInfo && userInfo.p_idx)}
                handleInputChange={() => {}}
                handleSelect={() => {}}
                handleTopBtnClick={() => {}}
                view={true}
                handleSetFiles={() => {}}
                filesData={{
                  환자정보: {
                    첨부: [],
                  },
                }}
                getFileGubun={getFileGubun}
                onRemove={() => {}}
                tabType={"patient"}
              />
            </div>
          )}

          {meetingInfo && (
            <div
              className={`meeting-area relative ${
                !patientInfo || !chartInfo || !patientViewOpened
                  ? "full-view"
                  : ""
              }`}
            >
              <button
                className="sidebar-controller"
                onClick={() => {
                  console.log("Sidebar button clicked, current state:", patientViewOpened);
                  setPatientViewOpened(!patientViewOpened);
                  console.log("New state will be:", !patientViewOpened);
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
                roomUrl={meetingInfo.hostRoomUrl + "&logo=off"}
                userName={name}
                meetingId={meetingInfo.meetingId}
              />
            </div>
          )}
        </div>
      </>
    );
}

const getFileGubun = (tabType: WorkflowTabType) => {
  let gubun1: Gubun1;
  switch (tabType) {
    case "patient": {
      gubun1 = "환자정보";
      break;
    }
    case "opinion": {
      gubun1 = "소견서정보";
      break;
    }
    case "carePlans": {
      gubun1 = "치료계획서";
      break;
    }
    case "visitForm": {
      gubun1 = "내원준비";
      break;
    }
    case "visitInfo": {
      gubun1 = "내원상담";
      break;
    }
    case "visitResult": {
      gubun1 = "내원결과";
      break;
    }
    case "postConsulting": {
      gubun1 = "사후상담";
      break;
    }
    case "postPrescript": {
      gubun1 = "사후처방";
      break;
    }
  }

  return gubun1;
};