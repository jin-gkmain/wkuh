import React, { useCallback, useContext, useEffect, useState } from "react";
import Next from "./icons/Next";
import Stethoscope from "./icons/Stethoscope";
import Cross from "./icons/Cross";
import { SidebarTabType, TeleAppt, VisitAppt, WorkflowAlert } from "./SideBar";
import FlagMongolSq from "./icons/FlagMongolSq";
import FlagKoreaSq from "./icons/FlagKoreaSq";
import FlagMongolRd from "./icons/FlagMongolRd";
import FlagKoreaRd from "./icons/FlagKoreaRd";
import { convertTimeToStr, getDayDiff, getTimeElapsed } from "@/utils/date";
import { useAppSelector } from "@/store";
import { LanguageContext } from "@/context/LanguageContext";
import dayjs from "dayjs";
import AlertIcon from "./AlertIcon";
import langFile from "@/lang";
import { getSystemAlertText } from "@/utils/alert";
import { SideWorkflowAlertType } from "@/types/alert";
import { getUserByUIdx } from "@/data/users";
import org, { getOrg } from "@/data/org";
import FlagKazSq from "./icons/FlagKazSq";

type Props = {
  type: SidebarTabType;
  item: TeleAppt | VisitAppt | SideWorkflowAlertType;
  onClick: () => void;
};

export default function SidebarItem({ item, type, onClick }: Props) {
  const { userInfo } = useAppSelector(({ user }) => user);
  const [countryFlag, setCountryFlag] = useState<React.ReactNode | null>(null);
  const { lang } = useContext(LanguageContext);
  const {
    u_name_eng,
    p_chart_no,
    nurse1_idx,
    nurse2_idx,
    doctor1_idx,
    doctor2_idx,
    doctor1_name_eng,
    doctor1_name_kor,
    doctor2_name_eng,
    doctor2_name_kor,
    nurse1_name_eng,
    nurse1_name_kor,
    nurse2_name_eng,
    nurse2_name_kor,
  } = item;
  const format = "YYYY-MM-DD HH:mm";

  const getCountryFlag = useCallback(async (userIdx: number) => {
    const user = await getUserByUIdx(userIdx);
    if (user === "ServerError") return null;
    const country = user[0].country;
    if (country === "mongolia") return <FlagMongolRd />;
    else if (country === "kazakhstan") return <FlagKazSq />;
    else return null;
  }, []);

  const getDdayDiff = useCallback((): number => {
    let date: string;
    if ("te_date" in item) date = item.te_date;
    else if ("vii_tad" in item) date = item.vii_tad;
    else if ("registdate_utc" in item) date = item.registdate_utc;

    let today = new Date().toISOString();
    let diff;
    today = convertTimeToStr(userInfo.country, today, "-");
    let appDate = convertTimeToStr(userInfo.country, date, "-");

    diff = dayjs(appDate).diff(today, "day");

    return Math.abs(getDayDiff(appDate, today, userInfo.country, false));
  }, []);

  const getTimeElapseStr = useCallback(() => {
    let date: string;
    if ("te_date" in item) date = item.te_date;
    else if ("vii_tad" in item) date = item.vii_tad;
    else if ("registdate_utc" in item) date = item.registdate_utc;

    let today = new Date().toISOString();

    const { type, val } = getTimeElapsed(date, today, userInfo.country);

    let str = "";
    if (lang === "en") str += `${langFile[lang].SIDEBAR_TIEM_ELLAPSE_TEXT1} `; // about
    str += `${val}`;

    if (type === "minute") {
      str += ` ${langFile[lang].SIDEBAR_TIEM_ELLAPSE_TEXT6}`; // 분
    } else if (type === "hour") {
      str += ` ${langFile[lang].SIDEBAR_TIEM_ELLAPSE_TEXT5}`; // 시간
    } else if (type === "day") {
      str += ` ${langFile[lang].SIDEBAR_TIEM_ELLAPSE_TEXT4}`; // 일
    } else if (type === "month") {
      str += ` ${langFile[lang].SIDEBAR_TIEM_ELLAPSE_TEXT3}`; // 달
    } else if (type === "year") {
      str += ` ${langFile[lang].SIDEBAR_TIEM_ELLAPSE_TEXT2}`; // 년
    }

    if (val > 1 && lang === "en") str += `s`;

    str += ` ${langFile[lang].SIDEBAR_TIEM_ELLAPSE_TEXT7}`; // 전

    return str;
  }, [lang]);

  useEffect(() => {
    if (doctor1_idx) {
      getCountryFlag(doctor1_idx).then((flag) => setCountryFlag(flag));
    }
  }, [doctor1_idx, getCountryFlag]);

  return (
    <div className="sidebar-item justify-between container">
      {/* SidebarItem 왼쪽 영역 */}
      <div className="item-left flex align-center gap-10">
        {/* <span className={`item-bedge `}>D-0</span> */}
        {type === "appointments" && (
          <span className={`item-bedge ${getDdayDiff() === 0 ? "today" : ""} `}>
            D-{getDdayDiff()}
          </span>
        )}

        {type === "workflow" && (
          <span className={`item-bedge workflow`}>
            <AlertIcon
              tab={item.gubun}
              type={"status" in item ? item.status : "save"}
            />
          </span>
        )}

        <span className="flex flex-col gap-5">
          <p className="font-bold flex flex-col gap-5">
            <span className="patient-name flex align-center" onClick={onClick}>
              <span className="truncate">{u_name_eng} </span>
              <Next />
            </span>
            <span className="chart-id">({p_chart_no})</span>
          </p>
          {/* sidebar tabType 이 appointment 인 경우 > 날짜 영역 */}
          {type === "appointments" && (
            <div className="dates flex flex-col gap-3">
              <p className="flex gap-3">
                {"te_date" in item
                  ? convertTimeToStr(
                      userInfo.country,
                      item.te_date,
                      null,
                      format
                    )
                  : ""}
                {"vii_tad" in item
                  ? convertTimeToStr(
                      userInfo.country,
                      item.vii_tad,
                      null,
                      format
                    )
                  : ""}
              </p>
            </div>
          )}

          {/* sidebar tabType 이 workflow 인 경우 > text 영역 */}
          {type === "workflow" && (
            <div className="text-area">
              {lang === "ko"
                ? (item as SideWorkflowAlertType).regist_name_kor
                : (item as SideWorkflowAlertType).regist_name_eng}
              {getSystemAlertText(
                lang,
                item.gubun,
                (item as SideWorkflowAlertType).status
              )}
              <p className="time-ellapse">{getTimeElapseStr()}</p>
            </div>
          )}
        </span>
      </div>

      {/* SidebarItem 오른쪽 영역 */}
      <div className="item-right flex flex-col gap-3">
        {nurse1_idx && (
          <p className="flex gap-5">
            <span className="flex">
              {countryFlag}
              <Cross />
            </span>
            <span className="truncate">
              {lang === "ko" ? nurse1_name_kor : nurse1_name_eng}
            </span>
          </p>
        )}
        {doctor1_idx && (
          <p className="flex gap-5">
            <span className="flex">
              {countryFlag}
              <Stethoscope />
            </span>
            <span className="truncate">
              {lang === "ko" ? doctor1_name_kor : doctor1_name_eng}
            </span>
          </p>
        )}
        {nurse2_idx && (
          <p className="flex gap-5">
            <span className="flex">
              <FlagKoreaRd />
              <Cross />
            </span>
            <span className="truncate">
              {lang === "ko" ? nurse2_name_kor : nurse2_name_eng}
            </span>
          </p>
        )}
        {doctor2_idx && (
          <p className="flex gap-5">
            <span className="flex">
              <FlagKoreaRd />
              <Stethoscope />
            </span>
            <span className="truncate">
              {lang === "ko" ? doctor2_name_kor : doctor2_name_eng}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
