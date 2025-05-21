import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Layout from '@/components/common/Layout';
import MyHead from '@/components/common/MyHead';
import MyBarChart from '@/components/common/chart/MyBarChart';
import MyLineChart from '@/components/common/chart/MyLineChart';
import MyPieChart from '@/components/common/chart/MyPieChart';
import { LangType, LanguageContext } from '@/context/LanguageContext';
import { useAppSelector } from '@/store';
import { convertTimeToStr } from '@/utils/date';
import { useRouter } from 'next/router';
import langFile from '@/lang';
import dayjs from 'dayjs';
import {
  getChartInfo,
  getCompletedVisitist,
  getPatientRegistList,
  getPpRegistList,
  getTeleUsageList,
  getTodayTelePatients,
  getTodayVisitPatients,
  getUserListByJob,
} from '@/data/dashboard';
import Select, { SelectOptionType } from '@/components/common/inputs/Select';
import getOrgs from '@/data/org';

type DefaultChartInfo = {
  o_idx: number;
  o_name_kor: string;
  o_name_eng: string;
  data: number[];
};

type TodayAptItem = TodayAppointmentPatientResType & { date: string };

type ColoredUserChartResType = UserChartResType & { color: string };

export default function DashBoardPage() {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { lang } = useContext(LanguageContext);
  const [teleChartInfo, setTeleChartInfo] = useState<DefaultChartInfo[] | null>(
    null
  );
  const [patientChartInfo, setPatientChartInfo] = useState<
    DefaultChartInfo[] | null
  >(null);

  const [todayTeAptisList, setTodayTeAptList] = useState<TodayAptItem[] | null>(
    []
  );
  const [todayViAptList, setTodayVitAptList] = useState<TodayAptItem[] | null>(
    []
  );

  const [usersChartList, setUsersChartList] = useState<
    ColoredUserChartResType[] | null
  >(null);

  const [ppChartInfo, setPpChartInfo] = useState<DefaultChartInfo[] | null>(
    null
  );

  const [cpVisitChartInfo, setCpVisitChartInfo] = useState<
    DefaultChartInfo[] | null
  >(null);

  const [selectedHospital, setSelectedHospital] = useState(0);

  // test2.용 (병원 선택)
  const [orgOptions, setOrgOptions] = useState<SelectOptionType[] | null>(null);
  const [selectedOrg, setSelectedOrg] = useState('0');

  const jobs = [
    {
      key: 'nurse',
      name: langFile[lang].USER_MODAL_USER_JOB1,
    },
    {
      key: 'doctor',
      name: langFile[lang].USER_MODAL_USER_JOB2,
    },
    {
      key: 'interpreter',
      name: langFile[lang].USER_MODAL_USER_JOB3,
    },
  ];

  const chartRef = useRef(null);

  const router = useRouter();

  const getData = (data: DefaultChartInfo[]) => {
    return data
      ? data?.map(({ o_name_kor, o_name_eng, data }) => ({
          label: lang === 'ko' ? o_name_kor : o_name_eng,
          data: data,
        }))
      : [];
  };

  const getDataNew = () => {
    let te = teleChartInfo?.map(({ data }) => ({
      label: langFile[lang].DASHBOARD_CURRENT_TELE_USAGE_STATUS_TITLE, // '원격 협진 사용 현황'
      data,
    }));

    let vir = cpVisitChartInfo?.map(({ data }) => ({
      label: langFile[lang].DASHBOARD_CURRENT_VIR_COMPLETE_STATUS_TITLE, // '내원 완료 현황'
      data,
    }));

    let pp = ppChartInfo?.map(({ data }) => ({
      label: langFile[lang].DASHBOARD_CURRENT_PP_REGISTRATION_STATUS_TITLE, // '처방전 현황'
      data,
    }));

    let result = [];

    if (te) result = [...result, ...te];
    if (vir) result = [...result, ...vir];
    if (pp) result = [...result, ...pp];

    return result;
  };

  const getMaxY = (chartData: DefaultChartInfo[]) => {
    let max = 0;
    let data = getData(chartData);
    data.map((i) => {
      const innerMax = Math.max(...i.data);
      if (innerMax > max) max = innerMax;
    });

    return max;
  };

  const getMonths = useCallback(() => {
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    return Array.from({ length: 12 }, (_, x) => x).map(
      (i) => langFile[lang][months[i]]
    );
  }, [lang]);

  const getUsersCount = useCallback(() => {
    if (selectedHospital) {
      let selected = usersChartList.find((u) => u.o_idx === selectedHospital);
      if (selected) {
        const { nurse_count, doctor_count, interpreter_count } = selected;

        return [nurse_count, doctor_count, interpreter_count];
      }
    }
    return [];
  }, [usersChartList, selectedHospital]);

  const handleSelectedHospital = (o_idx: number) => {
    setSelectedHospital(o_idx);
  };

  const getJobLabels = useCallback(() => {
    return jobs.map((i) => i.name);
  }, [lang]);

  const converTotDefaultChartType = (chartList: DefaultChartResType[]) => {
    return chartList.map((item) => ({
      o_idx: item.o_idx,
      o_name_kor: item.o_name_kor,
      o_name_eng: item.o_name_eng,
      data: [
        item.m1,
        item.m2,
        item.m3,
        item.m4,
        item.m5,
        item.m6,
        item.m7,
        item.m8,
        item.m9,
        item.m10,
        item.m11,
        item.m12,
      ],
    }));
  };

  const handleSelectedOrg = (selected: string) => {
    setSelectedOrg(selected);
  };

  const fillEmptyBody = (type: string): DefaultChartResType[] => {
    let selected = orgOptions?.find((i) => i.value === selectedOrg);

    let body = {
      o_idx: parseInt(selectedOrg),
      o_name_kor: selected?.key,
      o_name_eng: selected?.keyEn,
    };
    Array.from({ length: 12 }, (_, x) => x + 1).map((i) => (body[`m${i}`] = 0));

    return [body] as DefaultChartResType[];
  };

  // 협진사용현황 데이터 목록 받아오기
  useEffect(() => {
    if (!userInfo || userInfo.p_idx) return null;
    let o_idx = userInfo.country !== 'korea' ? userInfo.o_idx : 0;

    const fetchPatientChartInfo = async () => {
      const res = await getPatientRegistList(o_idx);
      if (res !== 'ServerError') {
        setPatientChartInfo(converTotDefaultChartType(res));
      }
    };

    const fetchUsersChartInfo = async () => {
      const res = await getUserListByJob(o_idx);
      if (res !== 'ServerError') {
        setUsersChartList(
          res.map((i) => ({ ...i, color: getRandomRGBColor() }))
        );
        setSelectedHospital(res[0].o_idx);
      }
    };

    const fetchTodayAppointments = async () => {
      const te = await getTodayTelePatients(o_idx);
      if (te !== 'ServerError') {
        let mapped = te.map((i) => ({ ...i, date: i.te_date }));
        setTodayTeAptList(mapped);
      }
      const vii = await getTodayVisitPatients(o_idx);
      if (vii !== 'ServerError') {
        let mapped = vii.map((i) => ({ ...i, date: i.vii_tad }));
        setTodayVitAptList(mapped);
      }
    };

    fetchPatientChartInfo();
    fetchUsersChartInfo();
    fetchTodayAppointments();
  }, [userInfo]);

  // 기관목록 불러오기
  useEffect(() => {
    if (!userInfo) return;
    if (userInfo.p_idx) {
      router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
      return;
    }

    const fetchOrg = async () => {
      const search = userInfo.country === 'korea' ? 'parent_o_idx' : 'o_idx';
      const res = await getOrgs({ search, search_key: userInfo.o_idx });

      if (res !== 'ServerError') {
        const options = res.map((i) => ({
          key: i.o_name_kor,
          keyEn: i.o_name_eng,
          value: i.o_idx.toString(),
        }));
        setOrgOptions(options);
        if (res.length) {
          setSelectedOrg(options[0].value);
        }
      }
    };

    fetchOrg();
  }, [userInfo]);

  // 선택된 기관의 내원완료, 협진완료, 처방전등록 데이터
  useEffect(() => {
    if (!selectedOrg) return;

    const fetchTeleChartInfo = async () => {
      const res = await getChartInfo('te', parseInt(selectedOrg));
      let body;
      if (res !== 'ServerError') {
        if (res.length) {
          body = res;
        } else {
          body = fillEmptyBody('te');
        }

        setTeleChartInfo(converTotDefaultChartType(body));
      }
    };

    const fetchVisitChartInfo = async () => {
      const res = await getChartInfo('vir', parseInt(selectedOrg));
      let body;
      if (res !== 'ServerError') {
        if (res.length) {
          body = res;
        } else {
          body = fillEmptyBody('vir');
        }
        setCpVisitChartInfo(converTotDefaultChartType(body));
      }
    };

    const fetchPpChartInfo = async () => {
      const res = await getChartInfo('pp', parseInt(selectedOrg));
      let body;
      if (res !== 'ServerError') {
        if (res.length) {
          body = res;
        } else {
          body = fillEmptyBody('pp');
        }
        setPpChartInfo(converTotDefaultChartType(body));
      }
    };

    fetchTeleChartInfo();
    fetchVisitChartInfo();
    fetchPpChartInfo();
  }, [selectedOrg]);

  return (
    <>
      <MyHead subTitle="dashboard" />
      <div className="dashboard-page page-contents">
        <article className="charts-area">
          {/* 병원 선택시 test1.*/}
          <section className="chart-section">
            <h2>
              {langFile[lang].DASHBOARD_CURRENT_USAGE_STATUS_TITLE}
              {/* 사용 현황 */}
            </h2>
            {userInfo?.country === 'korea' && (
              <div className="select-wrap">
                <Select
                  options={orgOptions || []}
                  selected={selectedOrg}
                  setSelected={handleSelectedOrg}
                  selectType="chart"
                />
              </div>
            )}
            <div className="chart-wrap">
              {userInfo && userInfo.country === 'korea' && (
                <MyBarChart
                  max={getMaxY(getDataNew()) + 5}
                  step={10}
                  labels={getMonths()}
                  data={getDataNew()}
                />
              )}
              {userInfo && userInfo.country !== 'korea' && (
                <MyLineChart
                  legend={true}
                  chartRef={chartRef}
                  max={getMaxY(getDataNew()) + 5}
                  step={10}
                  labels={getMonths()}
                  data={getDataNew()}
                />
              )}
            </div>
          </section>

          <div className="row">
            <section className="chart-section pi-chart-section">
              <h2>
                {langFile[lang].DASHBOARD_USER_STATUS_TITLE}
                {/* 사용자 현황 */}
              </h2>
              <MyPieChart labels={getJobLabels()} data={getUsersCount()} />

              <div className="pie-options">
                {usersChartList &&
                  usersChartList.length > 1 &&
                  usersChartList.map((u) => (
                    <p
                      key={u.o_idx}
                      className={`pie-option ${
                        u.o_idx === selectedHospital ? 'selected' : ''
                      }`}
                      onClick={() => handleSelectedHospital(u.o_idx)}
                    >
                      <span
                        className="dot"
                        style={{ backgroundColor: u.color }}
                      ></span>
                      <span className="option-name">
                        {lang === 'ko' ? u.o_name_kor : u.o_name_eng}
                      </span>
                    </p>
                  ))}
              </div>
            </section>

            <section className="chart-section upcomming-disagnosis-area">
              <h2>
                {
                  langFile[lang]
                    .DASHBOARD_PATIENTS_SCHEDULED_FOR_TREATMENT_TITLE
                }
                {/* 진료 예정 환자 */}
              </h2>
              <div className="cards-area">
                <CardItem
                  userInfo={userInfo}
                  items={todayTeAptisList}
                  lang={lang}
                  type="tele"
                />
                <CardItem
                  userInfo={userInfo}
                  items={todayViAptList}
                  lang={lang}
                  type="visit"
                />
              </div>
            </section>
          </div>

          <section className="chart-section">
            <h2>
              {
                langFile[lang]
                  .DASHBOARD_CURRENT_PATIENT_REGISTRATION_STATUS_TITLE
              }
              {/* 환자 등록 현황 */}
            </h2>

            <div className="chart-wrap">
              {userInfo && userInfo.country === 'korea' && (
                <MyBarChart
                  max={getMaxY(patientChartInfo) + 5}
                  step={10}
                  labels={getMonths()}
                  data={getData(patientChartInfo)}
                />
              )}
              {userInfo && userInfo.country !== 'korea' && (
                <MyLineChart
                  chartRef={chartRef}
                  max={getMaxY(patientChartInfo) + 5}
                  step={10}
                  labels={getMonths()}
                  data={getData(patientChartInfo)}
                />
              )}
            </div>
          </section>
        </article>
      </div>
    </>
  );
}

DashBoardPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

type CardItemProps = {
  userInfo: StoredUser | null;
  items: TodayAptItem[] | null;
  lang: LangType;
  type: 'tele' | 'visit';
};

function CardItem({ userInfo, items, lang, type }: CardItemProps) {
  return (
    <div className="my-card">
      <header className="card-header">
        <p>
          {type === 'tele'
            ? langFile[lang].DASHBOARD_TODAY_TELE_PATIENT
            : langFile[lang].DASHBOARD_TODAY_VISIT_PATIENT}
        </p>
        <p className="dates">
          <span>
            {dayjs(
              convertTimeToStr(
                userInfo.country || 'korea',
                new Date().toISOString(),
                '-'
              )
            ).format('dddd')}
          </span>
          <span className="vertical-bar"></span>
          <span>
            {convertTimeToStr(
              userInfo.country || 'korea',
              new Date().toISOString(),
              '-'
            )}
          </span>
        </p>
      </header>
      <article>
        <ul className="card-menu">
          <li className="truncate">
            {langFile[lang].DASHBOARD_P_NAME_TEXT}
            {/* 환자명 */}
          </li>
          <li className="truncate">
            {langFile[lang].DASHBOARD_P_ORG_TEXT}
            {/* 기관 */}
          </li>
          <li className="truncate">
            {langFile[lang].DASHBOARD_DOCTOR_TEXT}
            {/* 담당의 */}
          </li>
          <li className="truncate">
            {
              type === 'tele'
                ? langFile[lang].DASHBOARD_TELE_DATE_TEXT // 협진일시
                : langFile[lang].DASHBOARD_VISIT_DATE_TEXT // 내원일시
            }
          </li>
        </ul>

        <div className="items">
          {items &&
            items.map(
              (
                {
                  o_name_eng,
                  o_name_kor,
                  p_idx,
                  u_name_eng,
                  u_name_kor,
                  doctor1_name_kor,
                  doctor1_name_eng,
                  doctor2_name_kor,
                  doctor2_name_eng,
                  date,
                },
                idx
              ) => (
                <div className="item" key={type + p_idx + idx}>
                  <span className="truncate">{u_name_eng}</span>
                  <span className="vertical-bar"></span>
                  <span className="truncate">
                    {lang === 'ko' ? o_name_kor : o_name_eng}
                  </span>
                  <span className="vertical-bar"></span>
                  <span className="truncate">
                    {userInfo.country === 'korea'
                      ? lang === 'ko'
                        ? doctor2_name_kor
                        : doctor2_name_eng
                      : lang === 'ko'
                      ? doctor1_name_kor
                      : doctor1_name_eng}
                  </span>
                  <span className="vertical-bar"></span>
                  <span className="truncate">
                    <p>
                      {convertTimeToStr(
                        userInfo.country,
                        date,
                        null,
                        'YYYY-MM-DD'
                      )}
                    </p>
                    <p className="time">
                      {convertTimeToStr(
                        userInfo.country,
                        date,
                        null,
                        'a hh:mm'
                      )}
                    </p>
                  </span>
                </div>
              )
            )}

          {(!items || !items.length) && (
            <h3 className="empty-pts">
              {langFile[lang].DASHBOARD_NO_WAITING_PTS}
              {/* 진료 예정인 환자가 없습니다. */}
            </h3>
          )}
        </div>
      </article>
    </div>
  );
}

function getRandomRGBColor() {
  const r = Math.floor(Math.random() * 256); // 0-255
  const g = Math.floor(Math.random() * 256); // 0-255
  const b = Math.floor(Math.random() * 256); // 0-255
  return `rgb(${r}, ${g}, ${b})`;
}
