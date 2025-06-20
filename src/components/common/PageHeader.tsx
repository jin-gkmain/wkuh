import React, { useContext, useEffect, useState } from "react";
import Next from "./icons/Next";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";
import langFile from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";

type TabInfo = {
  title: string;
  description: string;
  depth: { url: string; text: string }[];
};

export default function PageHeader() {
  const { webLang } = useContext(LanguageContext);
  const [headerInfoObj, setHeaderInfoObj] = useState<TabInfo>({
    title: "",
    description: "",
    depth: [],
  });

  const router = useRouter();

  useEffect(() => {
    const paths = router.pathname.split("/").filter((item) => item.length > 1);
    const depth1 = paths[0];
    const depth2 = paths[1];
    const depth3 = paths[2];

    let headerInfoObj: TabInfo = {
      title: "",
      description: "",
      depth: [],
    };

    // path 에 따라서 page header 의 내용으로 사용될 객체를 변경.

    if (depth1 === "dashboard") {
      // setHeaderInfo(objs.find((item) => item.type === 'dashboard')!);
      headerInfoObj.title = langFile[webLang].PAGE_HEADER_DASHBOARD_TITLE_TEXT; // 대시보드
      headerInfoObj.description =
        langFile[webLang].PAGE_HEADER_DASHBOARD_DESC_TEXT; // 대시보드를 확인하고 관리해보세요
      headerInfoObj.depth = [
        { url: "/dashboard", text: depth1 },
        {
          url: "/dashboard",
          text: langFile[webLang].PAGE_HEADER_DASHBOARD_TITLE_TEXT, // 대시보드
        },
      ];
    } //
    else if (depth1 === "organizations") {
      headerInfoObj.depth.push({ url: "/organizations", text: depth1 });
      headerInfoObj.depth.push({
        url: "/organizations",
        text: langFile[webLang].PAGE_HEADER_ORG_LIST_TITLE_TEXT, // 기관목록
      });
      if (!depth2) {
        headerInfoObj.title = langFile[webLang].PAGE_HEADER_ORG_LIST_TITLE_TEXT; // 기관목록
        headerInfoObj.description =
          langFile[webLang].PAGE_HEADER_ORG_LIST_DESC_TEXT; // 기관목록을 확인하고 관리해보세요'
      } //
      else {
        if (depth2 === "users") {
          headerInfoObj.title =
            langFile[webLang].PAGE_HEADER_USER_LIST_TITLE_TEXT; // 사용자목록
          headerInfoObj.description =
            langFile[webLang].PAGE_HEADER_USER_LIST_DESC_TEXT; // 사용자목록을 확인하고 관리해보세요
          headerInfoObj.depth.push({
            url: "/organizations/users",
            text: langFile[webLang].PAGE_HEADER_USER_LIST_TITLE_TEXT, // 사용자 목록
          });
        } else {
          if (depth3 === "users") {
            headerInfoObj.title =
              langFile[webLang].PAGE_HEADER_USER_LIST_TITLE_TEXT; // 사용자 목록
            headerInfoObj.description =
              langFile[webLang].PAGE_HEADER_USER_LIST_DESC_TEXT; // 사용자목록을 확인하고 관리해보세요
            headerInfoObj.depth.push({
              // url: '/organizations/2/users',
              url: `/organizations/${router.query.id}/users`,
              text: langFile[webLang].PAGE_HEADER_USER_LIST_TITLE_TEXT, // 사용자 목록
            });
          }
        }
      }
    } //
    else if (depth1 === "workflow") {
      headerInfoObj.depth.push({ url: "/workflow", text: depth1 });
      headerInfoObj.depth.push({
        url: "/workflow",
        text: langFile[webLang].PAGE_HEADER_PATIENT_LIST_TITLE_TEXT, // 환자목록
      });
      if (!depth2) {
        headerInfoObj.title =
          langFile[webLang].PAGE_HEADER_PATIENT_LIST_TITLE_TEXT; // 환자목록
        headerInfoObj.description =
          langFile[webLang].PAGE_HEADER_PATIENT_LIST_DESC_TEXT; // 환자를 추가하고 환자별 진료들을 관리해보세요
      } //
      else if (depth2 === "diagnosis") {
        headerInfoObj.title =
          langFile[webLang].PAGE_HEADER_CHART_LIST_TITLE_TEXT; // 진료목록
        headerInfoObj.description =
          langFile[webLang].PAGE_HEADER_CHART_LIST_DESC_TEXT; // 진료목록을 확인하고 관리헤보세요
        headerInfoObj.depth.push({
          url: `/workflow/diagnosis/${router.query.id as string}`,
          text: langFile[webLang].PAGE_HEADER_CHART_LIST_TITLE_TEXT, // 진료목록
        });
      }
    } //
    else if (depth1 === "appointments") {
      headerInfoObj.title =
        langFile[webLang].PAGE_HEADER_SCHEDULE_LIST_TITLE_TEXT; // 일정목록
      headerInfoObj.description =
        langFile[webLang].PAGE_HEADER_SCHEDULE_LIST_DESC_TEXT; // 일정을 확인하고 관리해보세요
      headerInfoObj.depth.push(
        { url: "/appointments", text: depth1 },
        {
          url: "/appointments",
          text: langFile[webLang].PAGE_HEADER_SCHEDULE_LIST_TITLE_TEXT, // 일정목록
        }
      );
    } //
    else if (depth1 === "notice") {
      headerInfoObj.title =
        langFile[webLang].PAGE_HEADER_NOTICE_LIST_TITLE_TEXT; // 공지사항
      headerInfoObj.description =
        langFile[webLang].PAGE_HEADER_NOTICE_LIST_DESC_TEXT; // 공지를 확인하고 관리해보세요
      headerInfoObj.depth.push(
        { url: "/notice", text: depth1 },
        {
          url: "/notice",
          text: langFile[webLang].PAGE_HEADER_NOTICE_LIST_TITLE_TEXT, // 공지사항
        }
      );
    } else if (depth1 === "history") {
      headerInfoObj.title =
        langFile[webLang].PAGE_HEADER_HISTORY_LIST_TITLE_TEXT; // 히스토리
      headerInfoObj.description =
        langFile[webLang].PAGE_HEADER_HISTORY_LIST_DESC_TEXT; // 히스토리를 확인하고 관리해보세요
      headerInfoObj.depth.push(
        { url: "/history", text: depth1 },
        {
          url: "/history",
          text: langFile[webLang].PAGE_HEADER_HISTORY_LIST_TITLE_TEXT, // 히스토리
        }
      );
    }

    setHeaderInfoObj(headerInfoObj);
  }, [router.pathname, webLang, router.query.id]);

  return (
    <div className="page-header">
      <div className="flex align-center">
        {headerInfoObj.depth.map((item, idx) => {
          return (
            <span key={idx} className="flex align-center path">
              <Link href={item.url}>
                {item.text.charAt(0).toUpperCase() + item.text.slice(1)}
              </Link>

              {idx === headerInfoObj.depth.length - 1 ? "" : <Next />}
            </span>
          );
        })}
      </div>
      <h2>{headerInfoObj.title}</h2>
      <p className="description">{headerInfoObj.description}</p>
    </div>
  );
}
