import React, { ReactNode, useContext, useEffect, useState } from "react";
import Calendar from "./icons/Calendar";
import Send from "./icons/Send";
import SidebarItem from "./SidebarItem";
import { WorkflowModalContext } from "@/context/WorkflowModalContext";
import {
  Gubun,
  workflowModalActions,
} from "@/store/modules/workflowModalSlice";
import { useAppDispatch } from "@/store";
import instance from "@/utils/myAxios";
import langFile from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";
import { Alert, AlertStatus, SideWorkflowAlertType } from "@/types/alert";
import {
  getSideTeAptList,
  getSideViiAptList,
  getSideWorkflowAlarm,
  readAllSideWorkflowAlarm,
  readSideWorkflowAlarm,
} from "@/data/alert";

export type SidebarTabType = "appointments" | "workflow";

const tabs: { type: SidebarTabType; icon: ReactNode }[] = [
  {
    type: "appointments",
    icon: <Calendar />,
  },
  {
    type: "workflow",
    icon: <Send />,
  },
];

type Appointment = {
  w_idx: number;
  p_idx: number;
  gubun: Gubun;
  u_name_eng: string;
  p_chart_no: string;
  nurse1_idx: number | null;
  nurse2_idx: number | null;
  doctor1_idx: number | null;
  doctor2_idx: number | null;
  nurse1_name_kor: string;
  nurse1_name_eng: string;
  nurse2_name_kor: string;
  nurse2_name_eng: string;
  doctor1_name_kor: string;
  doctor1_name_eng: string;
  doctor2_name_kor: string;
  doctor2_name_eng: string;
  ca_doctor_name_kor: string;
  ca_doctor_name_eng: string;
};

export type TeleAppt = Appointment & {
  te_date: string;
  te_link: string;
};

export type VisitAppt = Appointment & {
  vii_tad: string;
};

export type WorkflowAlert = Appointment & {
  idx: number;
  registdate_utc: string;
  status: AlertStatus;
  regist_name_kor: string;
  regist_name_eng: string;
};

// export type SideWorkflowAlertType = Alert & {
//   idx: number;
//   p_idx: number;
//   u_name_eng: string;
//   p_chart_no: string;
// };

const SideBar = () => {
  const { lang, webLang } = useContext(LanguageContext);
  const [tab, setTab] = useState<SidebarTabType>("appointments");
  const { openModal } = useContext(WorkflowModalContext);
  const [teleAppt, setTeleAppt] = useState<TeleAppt[] | null>([]);
  const [visitAppt, setVisitAppt] = useState<VisitAppt[] | null>([]);

  const [workflowAlertList, setWorkflowAlertlist] = useState<
    SideWorkflowAlertType[] | null
  >(null);
  const dispatch = useAppDispatch();

  const goToMeeting = (link: string) => {
    window.open(link);
  };

  const openTab = (item: SideWorkflowAlertType | VisitAppt) => {
    const { gubun, w_idx, p_idx } = item;
    dispatch(
      workflowModalActions.setDefaultInfoWithGubun({ gubun, w_idx, p_idx })
    );
    openModal();
  };

  const onClickWorkflowAlarm = async (item: SideWorkflowAlertType) => {
    const res = await readSideWorkflowAlarm(item.idx);
    if (res !== "ServerError") {
      if (res === "SUCCESS") {
        setWorkflowAlertlist((prev) => prev.filter((i) => i.idx !== item.idx));
      }
    }
    openTab(item);
  };

  const onClickReadAllAlarm = async () => {
    const res = await readAllSideWorkflowAlarm();
    if (res === "SUCCESS") {
      setWorkflowAlertlist([]);
    }
  };

  const fetchAppointments = async () => {
    const te = await getSideTeAptList<TeleAppt>();
    console.log("te >", te);
    if (te !== "ServerError") {
      const mapped = te.sort(
        (a, b) => new Date(a.te_date).getTime() - new Date(b.te_date).getTime()
      );
      setTeleAppt(mapped);
    }

    const vii = await getSideViiAptList<VisitAppt>();
    if (vii !== "ServerError") {
      const mapped = vii.sort(
        (a, b) => new Date(a.vii_tad).getTime() - new Date(b.vii_tad).getTime()
      );
      setVisitAppt(mapped);
    }
  };

  const fetchWorkflowAlerts = async () => {
    const res = await getSideWorkflowAlarm();
    if (res !== "ServerError") {
      let filtered = res.filter(
        (i) =>
          !(i.status === "complete" && i.gubun === "vir") &&
          !(i.status === "complete" && i.gubun === "te") &&
          !(i.status === "save" && i.gubun === "update")
      );
      setWorkflowAlertlist(filtered);
    }
  };

  useEffect(() => {
    if (tab === "appointments") {
      fetchAppointments();
    } else {
      fetchWorkflowAlerts();
    }
  }, [tab]);

  useEffect(() => {
    fetchWorkflowAlerts();
  }, []);

  return (
    <div className="sidebar-container">
      {/* tabs */}
      <div className="tabs-wrap">
        <ul className="tabs">
          {tabs.map(({ type, icon }) => (
            <li
              onClick={() => setTab(type)}
              key={type}
              className={`${
                tab === type && "selected"
              } flex flex-center relative`}
            >
              {icon}
              {type === "workflow" && (
                <span
                  className={`${
                    workflowAlertList && workflowAlertList.length > 0
                      ? "dot"
                      : ""
                  }`}
                ></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="groups">
        <div className="contents-container">
          {/* sidebar-top */}
          <section className={tab === "appointments" ? "h-50" : "h-full"}>
            <h2 className="section-title font-bold relative">
              {
                tab === "appointments"
                  ? langFile[webLang].SIDEBAR_TE_TITLE_TEXT // 원격협진
                  : langFile[webLang].SIDEBAR_ALARM_TITLE_TEXT // 알람
              }
              {tab === "workflow" && (
                <button
                  disabled={!workflowAlertList || !workflowAlertList.length}
                  className="read-all-button"
                  onClick={onClickReadAllAlarm}
                >
                  {langFile[webLang].SIDEBAR_ALL_READ_TEXT}
                  {/* 모두 읽기 */}
                </button>
              )}
            </h2>
            <div className="items-container">
              {tab === "appointments" &&
                teleAppt &&
                teleAppt.map((item, i) => (
                  <SidebarItem
                    key={item.w_idx + i}
                    item={item}
                    type={tab}
                    onClick={() => goToMeeting(item.te_link)}
                  />
                ))}

              {tab === "workflow" &&
                workflowAlertList &&
                workflowAlertList.map((item, idx) => (
                  <SidebarItem
                    key={item.idx}
                    item={item}
                    type={tab}
                    onClick={() => onClickWorkflowAlarm(item)}
                  />
                ))}
            </div>
          </section>

          {tab === "appointments" && (
            <section className="h-50">
              <h2 className="section-title font-bold">
                {langFile[webLang].SIDEBAR_VII_TITLE_TEXT}
                {/* 내원진료 */}
              </h2>
              <div className="items-container">
                {visitAppt &&
                  visitAppt.map((item, i) => (
                    <SidebarItem
                      key={item.w_idx + item.p_idx + i}
                      item={item}
                      type={tab}
                      onClick={() => openTab(item)}
                    />
                  ))}
                {/* {visits.map((item) => (
                  <section key={item.id} className="sidebar-item-container">
                    <SidebarItem
                      key={item.id}
                      item={item}
                      type={tab}
                      onClick={() => {}}
                    />
                  </section>
                ))} */}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
