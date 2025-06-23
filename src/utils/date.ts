import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ko";
import { LangType } from "@/context/LanguageContext";
import { Value } from "@/components/common/inputs/DateInput";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

// 달력 날짜를 문자열로 변환한다.
function getDateToStr(value: Value, sep: string) {
  let str = "";
  if (Array.isArray(value)) {
    str += `${dayjs(value[0]).format(`YYYY${sep}MM${sep}DD`)}~${dayjs(
      value[1]
    ).format(`YYYY${sep}MM${sep}DD`)}`;
  } else str += `${dayjs(value).format(`YYYY${sep}MM${sep}DD`)}`;

  return str;
}

// 인자로 전달받은 국가에 따라서 날짜를 문자열로 변환한다.
function convertTimeToStr(
  country: string, // 시간 계산 ( 회원의 국적에 따른 시간계산 )
  utcTime: string,
  sep?: string,
  format?: string
) {
  let str;

  const koDate = dayjs(utcTime).tz("Asia/Seoul");
  const mnDate = dayjs(utcTime).tz("Asia/Ulaanbaatar");
  const kzDate = dayjs(utcTime).tz("Asia/Almaty");

  if (country === "KR" || country === "korea") {
    if (format) {
      str = dayjs(koDate).format(format);
    } else {
      str = dayjs(koDate).format(`YYYY${sep}MM${sep}DD`);
    }
  } else if (country === "KZ" || country === "kazakhstan") {
    if (format) {
      str = dayjs(kzDate).format(format);
    } else {
      str = dayjs(kzDate).format(`YYYY${sep}MM${sep}DD`);
    }
  } else {
    if (format) {
      str = dayjs(mnDate).format(format);
    } else {
      str = dayjs(mnDate).format(`YYYY${sep}MM${sep}DD`);
    }
  }

  return str;
}

// 워크플로우 모달 내의 채팅 날짜 및 시스템 알림 날짜 변환 ( 국가, 언어 )
function convertChatTime(
  country: string, // 시간 계산 ( 회원의 국적에 따른 시간계산 )
  utcTime: string,
  lang?: "ko" | "en", // 언어에 따른 형식
  title?: boolean
) {
  let str;

  // const time = utcTime.toISOString();

  const koDate = dayjs(utcTime).tz("Asia/Seoul");
  const mnDate = dayjs(utcTime).tz("Asia/Ulaanbaatar");
  const kzDate = dayjs(utcTime).tz("Asia/Almaty");

  const ko = koDate.locale("ko");
  const mn = mnDate.locale("en");
  const kz = kzDate.locale("en");

  if (country === "KR" || country === "korea") {
    if (lang === "ko") {
      if (title) str = ko.format("YYYY.M.D(ddd) a h:mm"); // 한글 (채팅 생성)
      else str = ko.format("YYYY년 M월 D일 a h:mm"); // 한글(채팅)
    } else {
      const ko = koDate.locale("en");
      str = ko.format("MMM d, YYYY tt h:mm A");
      str = str.replace("tt", "at");
    }
  } else if (country === "KZ" || country === "kazakhstan") {
    if (lang === "ko") {
      if (title) str = kz.format("YYYY.M.D(ddd) a h:mm"); // 한글 (채팅 생성)
      else str = kz.format("YYYY년 M월 D일 a h:mm"); // 한글(채팅)
    } else {
      str = kz.format("MMM d, YYYY tt h:mm A");
      str = str.replace("tt", "at");
    }
  } else {
    if (lang === "ko") {
      const mn = mnDate.locale("ko");
      if (title) str = mn.format("YYYY.M.D(ddd) a h:mm"); // 한글 (채팅 생성)
      else str = mn.format("YYYY년 M월 D일 a h:mm"); // 한글(채팅)
    } else {
      str = mn.format("MMM d, YYYY tt h:mm A");
      str = str.replace("tt", "at");
    }
  }

  return str;
}

function getDayDiff(
  start: string,
  end: string,
  country: string,
  float?: boolean
) {
  let local;
  if (country === "korea") {
    local = "Asia/Seoul";
  } else if (country === "KZ" || country === "kazakhstan") {
    local = "Asia/Almaty";
  } else {
    local = "Asia/Ulaanbaatar";
  }

  const s_date = dayjs(start).tz(local);
  const e_date = dayjs(end).tz(local);

  return dayjs(e_date).diff(s_date, "day", float);
}

function getTimeElapsed(
  start: string,
  end: string,
  country: string
): { type: string; val: number } {
  let local;

  if (country === "korea") {
    local = "Asia/Seoul";
  } else if (country === "KZ" || country === "kazakhstan") {
    local = "Asia/Almaty";
  } else {
    local = "Asia/Ulaanbaatar";
  }

  const s_date = dayjs(start).tz(local);
  const e_date = dayjs(end).tz(local);

  const duration = dayjs.duration(e_date.diff(s_date));

  if (duration.asYears() >= 1) {
    return { type: "year", val: Math.floor(duration.asYears()) };
  } else if (duration.asMonths() >= 1) {
    return { type: "month", val: Math.floor(duration.asMonths()) };
  } else if (duration.asDays() >= 1) {
    return { type: "day", val: Math.floor(duration.asDays()) };
  } else if (duration.asHours() >= 1) {
    return { type: "hour", val: Math.floor(duration.asHours()) };
  } else {
    return { type: "minute", val: Math.floor(duration.asMinutes()) };
  }
}

function getIsPassed(
  base: Date,
  target: Date,
  target_country: string
): boolean {
  let local;

  if (target_country === "korea") {
    local = "Asia/Seoul";
  } else if (target_country === "KZ" || target_country === "kazakhstan") {
    local = "Asia/Almaty";
  } else {
    local = "Asia/Ulaanbaatar";
  }

  const b_date = dayjs(base);
  const t_date = dayjs(target).tz(local);

  if (t_date.isAfter(b_date)) {
    return true;
  } else {
    return false;
  }
}

export {
  getDayDiff,
  convertChatTime,
  convertTimeToStr,
  getDateToStr,
  getTimeElapsed,
  getIsPassed,
};
