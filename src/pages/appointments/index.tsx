import Layout from "@/components/common/Layout";
import Select, { SelectOptionType } from "@/components/common/inputs/Select";
import TableHead from "@/components/common/table/TableHead";
import TableRow from "@/components/common/table/TableRow";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import Calendar from "@/components/common/icons/Calendar";
import ScheduleModal from "@/components/modal/ScheduleModal";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import langFile from "@/lang";
import FlagMongolSq from "@/components/common/icons/FlagMongolSq";
import FlagKoreaSq from "@/components/common/icons/FlagKoreaSq";
import MyHead from "@/components/common/MyHead";
import { useAppSelector } from "@/store/index";
import { useRouter } from "next/router";
import getOrgs from "@/data/org";
import SearchAppointmentContent from "@/components/pages/appointments/SearchAppointmentContent";
import getAppointmentList from "@/data/appointment";
import { convertTimeToStr, getDayDiff } from "@/utils/date";
import { WorkflowModalContext } from "@/context/WorkflowModalContext";
import { useAppDispatch } from "@/store/index";
import { workflowModalActions } from "@/store/modules/workflowModalSlice";

export type AppointmentSearchInputs = {
  search_person: number | null;
  search_p_name: string;
  search_date: string | null;
};

type MyAppointment = Appointment & {
  date: string;
  gubun: "te" | "vii";
};

export default function AppointmentsPage() {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { webLang } = useContext(LanguageContext);
  const { openModal: openWorkflowModal } = useContext(WorkflowModalContext);
  const tds = getTableHeadData(webLang);
  const [hospitals, setHospitals] = useState<Organization[]>([]);
  const [hospitalsOptions, setHospitalsOptions] = useState<SelectOptionType[]>(
    []
  );
  const [selectedHospital, setSelectedHospital] = useState("");
  const [appointments, setAppointments] = useState<MyAppointment[] | null>(
    null
  );
  const [modalOpened, setModalOpened] = useState(false);
  const [searchInputs, setSearchInputs] = useState<AppointmentSearchInputs>({
    search_person: null,
    search_date: null,
    search_p_name: "",
  });

  const router = useRouter();
  const dispatch = useAppDispatch();

  // 병원목록 받기
  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.p_idx) {
      router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
      return;
    }

    let search = userInfo.country === "korea" ? "parent_o_idx" : "o_idx";
    let search_key = userInfo.o_idx;

    const fetchOrgs = async () => {
      const h = await getOrgs({
        search,
        search_key,
      });

      if (h !== "ServerError") {
        setHospitals(h);
      } else {
        console.log("병원 목록 데이터 받기 실패");
      }
    };

    fetchOrgs();
  }, [userInfo]);

  // 병원목록을 이용하여 병원 select options 를 조합하여 설정
  useEffect(() => {
    let options: SelectOptionType[] = [];
    hospitals.forEach((o) => {
      const option: SelectOptionType = {
        key: o.o_name_kor || "",
        keyEn: o.o_name_eng || "",
        value: o.o_idx.toString(),
      };
      options.push(option);
    });

    setHospitalsOptions(options);

    if (options.length) {
      setSelectedHospital(options[0].value);
    } else {
      setSelectedHospital("");
    }
  }, [hospitals]);

  const setSelected = (selected: string) => {
    const matched = hospitalsOptions.find((item) => item.value === selected);
    if (matched) {
      setSelectedHospital(matched.value);
    }
  };

  const closeModal = () => {
    setModalOpened(false);
  };

  const openModal = () => {
    setModalOpened(true);
  };

  useEffect(() => {
    if (selectedHospital) {
      const fetchApts = async () => {
        const res = await getAppointmentList(parseInt(selectedHospital), {
          ...searchInputs,
          search_person: searchInputs.search_person || "",
        });

        if (res !== "ServerError") {
          const te = res
            .filter((w) => w.te_date)
            .map((i) => ({ ...i, date: i.te_date.toString(), gubun: "te" }));

          const vii = res
            .filter((w) => w.vii_tad)
            .map((i) => ({ ...i, date: i.vii_tad.toString(), gubun: "vii" }));

          let joined = [...te, ...vii]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((i) => ({ ...i }));

          // if (searchInputs.search_date) {
          //   joined = joined.filter(
          //     (a) =>
          //       convertTimeToStr('korea', a.date, '-') ===
          //       searchInputs.search_date
          //   );
          // }
          if (searchInputs.search_date) {
            joined = joined.filter(
              (a) =>
                convertTimeToStr(userInfo.country, a.date, "-") ===
                searchInputs.search_date
            );
          }
          setAppointments(joined as MyAppointment[]);
        }
      };

      fetchApts();
    }
  }, [selectedHospital, searchInputs]);

  // 입장하기 버튼 클릭시 실행
  const handleClick = (apt: MyAppointment) => {
    if (apt.gubun === "te") {
      let diff = getDayDiff(
        apt.te_date.toString(),
        new Date().toISOString(),
        userInfo.country,
        true
      );

      if (diff >= 1) return;
      else window.open(apt.te_link, "_blank");
      //
    } else if (apt.gubun === "vii") {
      dispatch(
        workflowModalActions.setDefaultInfoWithGubun({
          gubun: apt.gubun,
          p_idx: apt.p_idx,
          w_idx: apt.w_idx,
        })
      );
      openWorkflowModal();
    }
  };

  const handleSearch = (searchInputs: AppointmentSearchInputs) => {
    setSearchInputs(searchInputs);
  };

  return (
    <div className="appointment-page page-contents">
      <MyHead subTitle="appointments" />
      {modalOpened && (
        <div className="modal-container">
          <div
            className="modal-background"
            role="presentation"
            onClick={closeModal}
          />
          <ScheduleModal
            country={userInfo.country}
            closeModal={closeModal}
            o_idx={selectedHospital}
          />
        </div>
      )}

      {/* 검색 영역 */}
      <SearchAppointmentContent handleSearch={handleSearch} />

      {/* 병원 filter, 등록 영역 */}
      <div className="flex justify-between controll-table-area">
        <div>
          {userInfo && userInfo.country === "korea" && (
            <Select
              options={hospitalsOptions}
              selectType="hospitalSelect"
              selected={selectedHospital}
              setSelected={setSelected}
            />
          )}
        </div>

        <button
          className="primary-btn show-calendar-btn flex align-center justify-between"
          onClick={openModal}
        >
          {langFile[webLang].OPEN_CALENDAR_BUTTON_TEXT}
          {/** 캘린더 열기 */} <Calendar />
        </button>
      </div>

      {/* 일정 목록 table */}
      <table className="w-full table">
        <TableHead tds={tds} />
        <tbody>
          {appointments &&
            appointments.map(
              (
                {
                  w_code,
                  date,
                  gubun,
                  p_name_eng,
                  nurse1_idx,
                  nurse1_name_eng,
                  nurse1_name_kor,
                  nurse2_idx,
                  nurse2_name_kor,
                  nurse2_name_eng,
                  doctor1_idx,
                  doctor1_name_eng,
                  doctor1_name_kor,
                  doctor2_idx,
                  doctor2_name_eng,
                  doctor2_name_kor,
                },
                idx
              ) => (
                <TableRow
                  key={idx + w_code + gubun + date}
                  menu={false}
                  handleClick={() => handleClick(appointments[idx])}
                  buttonText={
                    gubun === "te"
                      ? getDayDiff(
                          date.toString(),
                          new Date().toISOString(),
                          userInfo.country,
                          true
                        ) >= 1
                        ? langFile[webLang].APPOINTMENTS_TABLE_ROW_BUTTON_TEXT3
                        : langFile[webLang].APPOINTMENTS_TABLE_ROW_BUTTON_TEXT
                      : langFile[webLang].APPOINTMENTS_TABLE_ROW_BUTTON_TEXT2
                  }
                  onClickMenu={(type) => {}}
                  buttonActive={
                    !(
                      gubun === "te" &&
                      getDayDiff(
                        date.toString(),
                        new Date().toISOString(),
                        userInfo.country,
                        true
                      ) >= 1
                    )
                  }
                >
                  <td>{w_code}</td>
                  <td>
                    {gubun === "te"
                      ? langFile[webLang].CALENDAR_TAB_TELE_TEXT
                      : langFile[webLang].CALENDAR_TAB_VISIT_TEXT}
                  </td>
                  <td>{p_name_eng}</td>
                  <td>
                    {nurse1_idx
                      ? webLang === "ko"
                        ? nurse1_name_kor
                        : nurse1_name_eng
                      : "-"}
                  </td>
                  <td>
                    {doctor1_idx
                      ? webLang === "ko"
                        ? doctor1_name_kor
                        : doctor1_name_eng
                      : "-"}
                  </td>
                  <td>
                    {nurse2_idx
                      ? webLang === "ko"
                        ? nurse2_name_kor
                        : nurse2_name_eng
                      : "-"}
                  </td>
                  <td>
                    {doctor2_idx
                      ? webLang === "ko"
                        ? doctor2_name_kor
                        : doctor2_name_eng
                      : "-"}
                  </td>
                  <td>
                    {convertTimeToStr("korea", date, null, "YYYY-MM-DD a h:mm")}
                  </td>
                  <td>
                    {convertTimeToStr(
                      "mongolia",
                      date,
                      null,
                      "YYYY-MM-DD a h:mm"
                    )}
                  </td>
                </TableRow>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}

AppointmentsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// 진료 목록 table th
function getTableHeadData(lang: LangType) {
  const tds: TableHeadCol[] = [
    {
      key: langFile[lang].CHART_NUMBER_TEXT, // 진료번호
      value: "chartNumber",
      valueType: "id",
      type: "text",
    },
    {
      key: langFile[lang].APPOINTMENTS_CHART_TYPE_TEXT, // 진료유형
      value: "chartNumber",
      valueType: "id",
      type: "text",
    },
    {
      key: langFile[lang].APPOINTMENTS_PT_NAME_TEXT, // 환자명',
      value: "patientName",
      valueType: "localName",
      type: "text",
    },
    {
      key: langFile[lang].CHART_LOCAL_NURSE_TEXT, // 지역 간호사
      value: "localNurse",
      valueType: "localName",
      type: "text",
    },
    {
      key: langFile[lang].CHART_LOCAL_DOCTOR_TEXT, // 지역 의사
      value: "localDoctor",
      valueType: "localName",
      type: "text",
    },
    {
      icon: <FlagKoreaSq />,
      key: langFile[lang].CHART_NURSE_TEXT, // 간호사
      value: "nurse",
      valueType: "name",
      type: "text",
    },
    {
      icon: <FlagKoreaSq />,
      key: langFile[lang].CHART_DOCTOR_TEXT, // 의사
      value: "doctor",
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].KR_APPOINTMENTS_DATE_TEXT, // 한국 진행일자
      value: "appointMentDate",
      valueType: "date-long",
      type: "text",
    },
    {
      key: langFile[lang].MN_APPOINTMENTS_DATE_TEXT, // 몽골 진행일자
      value: "localAppointmentDate",
      valueType: "date-long",
      type: "text",
    },
    {
      key: "",
      value: null,
      type: "button",
    },
  ];
  return tds;
}
