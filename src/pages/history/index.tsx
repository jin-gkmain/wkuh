import HistorySearchBox from "@/components/common/HistorySearchBox";
import Layout from "@/components/common/Layout";
import MyHead from "@/components/common/MyHead";
import { ReactElement, useEffect, useState, useContext } from "react";
import getWorkflows from "@/data/workflow";
import { getUserByUIdx } from "@/data/users";
import { getOrg } from "@/data/org";
import { getMedicalDeptOptions } from "@/components/modal/UserModalBox";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Checkbox,
} from "@mui/material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import TableHead from "@/components/common/table/TableHead";
import TableRow from "@/components/common/table/TableRow";
import langFile from "@/lang";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import { useAppSelector } from "@/store";
import { getPatient } from "@/data/patient";

// dayjs 플러그인 추가
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
  const { lang } = useContext(LanguageContext);
  const { userInfo } = useAppSelector(({ user }) => user);
  const [allWorkflows, setAllWorkflows] = useState<Diagnosis[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<Diagnosis[]>([]);
  const [displayWorkflows, setDisplayWorkflows] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState<string[]>([]);
  const [selectedWorkflows, setSelectedWorkflows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 사용자 정보와 Organization 정보 캐시
  const [userCache, setUserCache] = useState<Map<number, User>>(new Map());
  const [orgCache, setOrgCache] = useState<Map<number, Organization>>(
    new Map()
  );
  const [patientCache, setPatientCache] = useState<Map<number, string>>(
    new Map()
  );

  const tds = getTableHeadData(lang);

  // 진료과 변환 헬퍼 함수
  const getMedicalDeptName = (medicalDept: string | null | number): string => {
    console.log("medical_dept 값:", medicalDept, "타입:", typeof medicalDept);

    if (!medicalDept) return langFile[lang].HISTORY_TABLE_DONT_KNOW;

    const medicalDeptOptions = getMedicalDeptOptions(lang, "doctor");
    const deptOption = medicalDeptOptions.find(
      (option) => option.value === String(medicalDept)
    );

    console.log("medicalDeptOptions:", medicalDeptOptions);
    console.log("찾은 deptOption:", deptOption);

    return deptOption ? deptOption.key : langFile[lang].HISTORY_TABLE_DONT_KNOW;
  };

  // 사용자 정보 가져오기 (캐시 사용)
  const getUser = async (u_idx: number | null): Promise<User | null> => {
    if (!u_idx) return null;

    if (userCache.has(u_idx)) {
      return userCache.get(u_idx) || null;
    }

    try {
      const users = await getUserByUIdx(u_idx);
      const user = users[0];
      if (user !== "ServerError" && user) {
        setUserCache((prev) => new Map(prev.set(u_idx, user)));
        return user;
      }
    } catch (error) {
      console.error(`사용자 정보 조회 실패 (u_idx: ${u_idx}):`, error);
    }

    return null;
  };

  // Organization 정보 가져오기 (캐시 사용)
  const getOrganization = async (
    o_idx: number | null
  ): Promise<Organization | null> => {
    if (!o_idx) return null;

    if (orgCache.has(o_idx)) {
      return orgCache.get(o_idx) || null;
    }

    try {
      const org = await getOrg(o_idx);
      if (org !== "ServerError" && org) {
        setOrgCache((prev) => new Map(prev.set(o_idx, org)));
        return org;
      }
    } catch (error) {
      console.error(`Organization 정보 조회 실패 (o_idx: ${o_idx}):`, error);
    }

    return null;
  };

  const getPatientSerialNo = async (
    p_idx: number | null
  ): Promise<string | null> => {
    if (!p_idx) return null;

    try {
      const patient = await getPatient(p_idx);
      if (patient !== "ServerError" && patient) {
        return patient.p_serial_no;
      } else {
        console.error(`Patient 정보 조회 실패 (p_idx: ${p_idx}):`, patient);
      }
    } catch (error) {
      console.error(`Patient 정보 조회 실패 (p_idx: ${p_idx}):`, error);
    }
    return null;
  };

  // 페이지 로드 시 모든 진료내역 가져오기
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true);

        if (!userInfo) {
          console.log("사용자 정보가 없습니다.");
          setLoading(false);
          return;
        }

        // 모든 진료내역을 가져온 후 클라이언트에서 필터링
        const workflows = await getWorkflows(0);
        console.log("workflows > ", workflows);
        if (Array.isArray(workflows)) {
          // 필터링 조건: workflow의 o_idx가 유저와 동일하거나 doctor2_idx가 로그인 유저와 동일한 경우
          const filteredByUser = workflows.filter(
            (workflow) =>
              workflow.o_idx === userInfo.o_idx ||
              workflow.doctor2_idx === userInfo.u_idx
          );

          // 최신순으로 정렬
          const sortedWorkflows = filteredByUser.sort(
            (a, b) =>
              dayjs(b.registdate_utc).valueOf() -
              dayjs(a.registdate_utc).valueOf()
          );

          setAllWorkflows(sortedWorkflows);
          setFilteredWorkflows(sortedWorkflows);

          // 필요한 사용자와 organization 정보 미리 로드
          const userIds = new Set<number>();
          const orgIds = new Set<number>();
          const patientIds = new Set<number>();

          sortedWorkflows.forEach(async (workflow) => {
            // 사용자 ID 수집
            if (workflow.doctor1_idx) userIds.add(workflow.doctor1_idx);
            if (workflow.doctor2_idx) userIds.add(workflow.doctor2_idx);

            // Organization ID 수집
            orgIds.add(workflow.o_idx);

            // Patient Serial No 수집
            if (workflow.p_idx) {
              patientIds.add(workflow.p_idx);
            }
          });

          // 현재 유저의 organization도 추가
          if (userInfo.o_idx) {
            orgIds.add(userInfo.o_idx);
          }

          // 사용자 정보 미리 로드
          const userPromises = Array.from(userIds).map(async (u_idx) => {
            const user = await getUser(u_idx);
            if (user) {
              console.log(`사용자 ${u_idx} (${user.u_name_kor}):`, {
                medical_dept: user.medical_dept,
                job: user.job,
              });
            }
            return { u_idx, user };
          });

          // Organization 정보 미리 로드
          const orgPromises = Array.from(orgIds).map(async (o_idx) => {
            const org = await getOrganization(o_idx);
            return { o_idx, org };
          });

          // Patient Serial No 정보 미리 로드
          const patientPromises = Array.from(patientIds).map(async (p_idx) => {
            const patientSerialNo = await getPatientSerialNo(p_idx);
            return { p_idx, patientSerialNo };
          });

          // 모든 데이터 로드 완료 대기
          const [userResults, orgResults, patientResults] = await Promise.all([
            Promise.all(userPromises),
            Promise.all(orgPromises),
            Promise.all(patientPromises),
          ]);

          // 로컬 orgCache 빌드
          const localOrgCache = new Map<number, Organization>();
          orgResults.forEach(({ o_idx, org }) => {
            if (org) {
              localOrgCache.set(o_idx, org);
            }
          });

          // 로컬 patientCache 빌드
          const localPatientCache = new Map<number, string>();
          patientResults.forEach(({ p_idx, patientSerialNo }) => {
            if (patientSerialNo) {
              localPatientCache.set(p_idx, patientSerialNo);
            }
          });

          // 상태 업데이트
          setOrgCache(localOrgCache);
          setPatientCache(localPatientCache);

          // 병원 리스트 추출 (로컬 orgCache 사용)
          const hospitalSet = new Set<string>();
          console.log("localOrgCache >", localOrgCache);
          sortedWorkflows.forEach((workflow) => {
            const org = localOrgCache.get(workflow.o_idx);
            if (org) {
              const orgName =
                lang === "ko"
                  ? org.o_name_kor || org.o_name_eng || "알 수 없음"
                  : org.o_name_eng || org.o_name_kor || "알 수 없음";
              hospitalSet.add(orgName);
            } else {
              hospitalSet.add("알 수 없음");
            }
          });
          const uniqueHospitals = Array.from(hospitalSet);
          setHospitals(uniqueHospitals);

          console.log(
            `총 ${workflows.length}개 중 ${sortedWorkflows.length}개의 진료내역을 조회했습니다.`
          );
        }
      } catch (error) {
        console.error("진료내역 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [userInfo]);

  // 필터링된 데이터가 변경될 때 페이지네이션 업데이트
  useEffect(() => {
    const totalPages = Math.ceil(filteredWorkflows.length / ITEMS_PER_PAGE);
    setTotalPages(totalPages);
    setCurrentPage(1); // 필터링 시 첫 페이지로 리셋
  }, [filteredWorkflows]);

  // 현재 페이지에 표시할 데이터 계산
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayWorkflows(filteredWorkflows.slice(startIndex, endIndex));
  }, [filteredWorkflows, currentPage]);

  // 검색 필터링 함수
  const handleSearch = (
    startDate: string,
    endDate: string,
    status: string[],
    selectedHospitals: string[],
    searchParam: string,
    searchValue: string
  ) => {
    console.log("검색 조건:", {
      startDate,
      endDate,
      status,
      selectedHospitals,
      searchParam,
      searchValue,
    });

    let filtered = [...allWorkflows];

    // 날짜 범위 필터링 (registdate_local 사용)
    if (startDate && endDate) {
      filtered = filtered.filter((workflow) => {
        const workflowDate = dayjs(workflow.registdate_utc);
        return workflowDate.isBetween(
          dayjs(startDate),
          dayjs(endDate),
          "day",
          "[]"
        );
      });
    } else if (startDate) {
      filtered = filtered.filter((workflow) => {
        const workflowDate = dayjs(workflow.registdate_utc);
        return workflowDate.isSameOrAfter(dayjs(startDate), "day");
      });
    } else if (endDate) {
      filtered = filtered.filter((workflow) => {
        const workflowDate = dayjs(workflow.registdate_utc);
        return workflowDate.isSameOrBefore(dayjs(endDate), "day");
      });
    }

    // 상태 필터링 (임시로 vii_vi_yn 필드 사용 - 내원여부)
    if (status.length > 0) {
      filtered = filtered.filter((workflow) => {
        // 상태를 매핑: 0=대기, 1=완료, 2=처방완료
        const workflowStatus = workflow.vii_vi_yn === "Y" ? "1" : "0";
        return status.includes(workflowStatus);
      });
    }

    // 병원(진료과) 필터링
    if (selectedHospitals.length > 0) {
      filtered = filtered.filter((workflow) => {
        const org = orgCache.get(workflow.o_idx);
        let orgName = "알 수 없음";
        if (org) {
          orgName =
            lang === "ko"
              ? org.o_name_kor || org.o_name_eng || "알 수 없음"
              : org.o_name_eng || org.o_name_kor || "알 수 없음";
        }
        return selectedHospitals.includes(orgName);
      });
    }

    // 검색어 필터링
    if (searchValue.trim()) {
      filtered = filtered.filter((workflow) => {
        if (searchParam === "doctor") {
          return (
            workflow.ca_doctor_name_kor
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            workflow.ca_doctor_name_eng
              ?.toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchParam === "specialty") {
          return workflow.ca_department
            ?.toLowerCase()
            .includes(searchValue.toLowerCase());
        }
        return true;
      });
    }

    setFilteredWorkflows(filtered);
  };

  // 상태 텍스트 변환
  const getStatusText = (workflow: Diagnosis) => {
    if (workflow.vii_vi_yn === "Y") {
      return langFile[lang].HISTORY_SEARCH_STATUS_COMPLETED;
    } else if (workflow.vii_vi_yn === "N") {
      return langFile[lang].HISTORY_SEARCH_STATUS_CANCELLED;
    } else {
      return langFile[lang].HISTORY_SEARCH_STATUS_WAITING;
    }
  };

  // 체크박스 선택 처리
  const handleWorkflowSelect = (workflowId: number, checked: boolean) => {
    if (checked) {
      setSelectedWorkflows([...selectedWorkflows, workflowId]);
    } else {
      setSelectedWorkflows(selectedWorkflows.filter((id) => id !== workflowId));
    }
  };

  // 전체 선택/해제 (현재 페이지)
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageIds = displayWorkflows.map((w) => w.w_idx);
      const combinedIds = [...selectedWorkflows, ...currentPageIds];
      const uniqueIds = combinedIds.filter(
        (id, index) => combinedIds.indexOf(id) === index
      );
      setSelectedWorkflows(uniqueIds);
    } else {
      const currentPageIds = displayWorkflows.map((w) => w.w_idx);
      setSelectedWorkflows(
        selectedWorkflows.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  // 현재 페이지의 전체 선택 상태 확인
  const isAllCurrentPageSelected = () => {
    if (displayWorkflows.length === 0) return false;
    return displayWorkflows.every((workflow) =>
      selectedWorkflows.includes(workflow.w_idx)
    );
  };

  // 현재 페이지의 일부 선택 상태 확인
  const isSomeCurrentPageSelected = () => {
    return displayWorkflows.some((workflow) =>
      selectedWorkflows.includes(workflow.w_idx)
    );
  };

  // 행 클릭 처리
  const handleRowClick = (workflowId: number) => {
    console.log("진료내역 상세보기:", workflowId);
    // TODO: 진료내역 상세 모달 또는 페이지로 이동
  };

  // 메뉴 처리
  const handleMenu = (type: string, workflowId: number) => {
    console.log("메뉴 액션:", type, workflowId);
    // TODO: 메뉴 액션 처리 (수정, 삭제 등)
  };

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // 테이블 상단으로 부드럽게 스크롤
    const tableElement = document.querySelector(".w-full.table");
    if (tableElement) {
      tableElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // 엑셀 다운로드 처리
  const handleExcelDownload = () => {
    if (selectedWorkflows.length === 0) {
      alert("다운로드할 진료내역을 선택해주세요.");
      return;
    }

    // 선택된 진료내역만 필터링
    const selectedData = allWorkflows.filter((workflow) =>
      selectedWorkflows.includes(workflow.w_idx)
    );

    // CSV 형태로 데이터 생성
    const headers = [
      langFile[lang].HISTORY_TABLE_NO,
      langFile[lang].HISTORY_TABLE_DOCTOR,
      langFile[lang].HISTORY_TABLE_DEPARTMENT,
      langFile[lang].HISTORY_TABLE_CO_DOCTOR,
      langFile[lang].HISTORY_TABLE_CO_DEPARTMENT,
      langFile[lang].HISTORY_TABLE_HOSPITAL,
      langFile[lang].HISTORY_TABLE_COUNTRY,
      langFile[lang].HISTORY_TABLE_PATIENT_ID,
      langFile[lang].HISTORY_TABLE_STATUS,
      langFile[lang].HISTORY_TABLE_TELE_DATE,
    ];

    const csvContent = [
      headers.join(","),
      ...selectedData.map((workflow, index) =>
        [
          index + 1,
          // Doctor name
          `"${
            workflow.o_idx === userInfo.o_idx
              ? // o_idx가 동일한 경우: doctor1을 doctor로 표시
                lang === "ko"
                ? workflow.doctor1_name_kor ||
                  langFile[lang].HISTORY_TABLE_DONT_KNOW
                : workflow.doctor1_name_eng ||
                  langFile[lang].HISTORY_TABLE_DONT_KNOW
              : // doctor2_idx가 동일한 경우: doctor2를 doctor로 표시
              lang === "ko"
              ? workflow.doctor2_name_kor ||
                langFile[lang].HISTORY_TABLE_DONT_KNOW
              : workflow.doctor2_name_eng ||
                langFile[lang].HISTORY_TABLE_DONT_KNOW
          }"`,
          // Department
          `"${
            workflow.o_idx === userInfo.o_idx
              ? // o_idx가 동일한 경우: doctor1의 진료과 (medical_dept)
                (() => {
                  const doctor1 = workflow.doctor1_idx
                    ? userCache.get(workflow.doctor1_idx)
                    : null;
                  return getMedicalDeptName(doctor1?.medical_dept);
                })()
              : // doctor2_idx가 동일한 경우: doctor2의 진료과 (medical_dept)
                (() => {
                  const doctor2 = workflow.doctor2_idx
                    ? userCache.get(workflow.doctor2_idx)
                    : null;
                  return getMedicalDeptName(doctor2?.medical_dept);
                })()
          }"`,
          // Co-doctor name
          `"${
            workflow.o_idx === userInfo.o_idx
              ? // o_idx가 동일한 경우: doctor2를 co-doctor로 표시
                lang === "ko"
                ? workflow.doctor2_name_kor ||
                  langFile[lang].HISTORY_TABLE_DONT_KNOW
                : workflow.doctor2_name_eng ||
                  langFile[lang].HISTORY_TABLE_DONT_KNOW
              : // doctor2_idx가 동일한 경우: doctor1을 co-doctor로 표시
              lang === "ko"
              ? workflow.doctor1_name_kor ||
                langFile[lang].HISTORY_TABLE_DONT_KNOW
              : workflow.doctor1_name_eng ||
                langFile[lang].HISTORY_TABLE_DONT_KNOW
          }"`,
          // Co-department
          `"${
            workflow.o_idx === userInfo.o_idx
              ? // o_idx가 동일한 경우: doctor2의 진료과 (medical_dept)
                (() => {
                  const doctor2 = workflow.doctor2_idx
                    ? userCache.get(workflow.doctor2_idx)
                    : null;
                  return getMedicalDeptName(doctor2?.medical_dept);
                })()
              : // doctor2_idx가 동일한 경우: doctor1의 진료과 (medical_dept)
                (() => {
                  const doctor1 = workflow.doctor1_idx
                    ? userCache.get(workflow.doctor1_idx)
                    : null;
                  return getMedicalDeptName(doctor1?.medical_dept);
                })()
          }"`,
          // Hospital name
          `"${(() => {
            // 무조건 workflow의 o_idx 기준으로 병원명 표시
            const org = orgCache.get(workflow.o_idx);
            if (org) {
              return lang === "ko"
                ? org.o_name_kor ||
                    org.o_name_eng ||
                    langFile[lang].HISTORY_TABLE_DONT_KNOW
                : org.o_name_eng ||
                    org.o_name_kor ||
                    langFile[lang].HISTORY_TABLE_DONT_KNOW;
            }
            return langFile[lang].HISTORY_TABLE_DONT_KNOW;
          })()}"`,
          // Country
          `"${(() => {
            // 무조건 workflow의 o_idx 기준으로 국가 표시
            const org = orgCache.get(workflow.o_idx);
            return org?.country || langFile[lang].HISTORY_TABLE_DONT_KNOW;
          })()}"`,
          workflow.w_code,
          `"${getStatusText(workflow)}"`,
          `"${
            workflow.te_date
              ? dayjs(workflow.te_date).format("YYYY-MM-DD")
              : langFile[lang].HISTORY_TABLE_TELE_DATE_NOT_SURE_TEXT
          }"`,
        ].join(",")
      ),
    ].join("\n");

    // BOM 추가 (한글 깨짐 방지)
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // 파일 다운로드
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `history_${dayjs().format("YYYY-MM-DD")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    console.log(
      `${selectedData.length} ${langFile[lang].HISTORY_TABLE_DOWNLOAD_MESSAGE}`
    );
  };

  // 페이지네이션 버튼 렌더링
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // 맨 첫 페이지로 이동 버튼 (<<)
    buttons.push(
      <Button
        key="first"
        variant="outlined"
        size="small"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
        sx={{
          minWidth: "40px",
          transition: "all 0.2s ease-in-out",
          "&.Mui-disabled": {
            color: "#ccc",
            borderColor: "#e0e0e0",
          },
        }}
      >
        ≪
      </Button>
    );

    // 이전 페이지 버튼 (<)
    buttons.push(
      <Button
        key="prev"
        variant="outlined"
        size="small"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        sx={{
          minWidth: "40px",
          transition: "all 0.2s ease-in-out",
          "&.Mui-disabled": {
            color: "#ccc",
            borderColor: "#e0e0e0",
          },
        }}
      >
        ‹
      </Button>
    );

    // 페이지 번호 버튼들
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={`page-${i}`}
          variant={i === currentPage ? "contained" : "outlined"}
          size="small"
          onClick={() => handlePageChange(i)}
          sx={{
            minWidth: "40px",
            transition: "all 0.2s ease-in-out",
            ...(i === currentPage
              ? {
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }
              : {
                  color: "#999",
                  borderColor: "#e0e0e0",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#ccc",
                  },
                }),
          }}
        >
          {i}
        </Button>
      );
    }

    // 다음 페이지 버튼 (>)
    buttons.push(
      <Button
        key="next"
        variant="outlined"
        size="small"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        sx={{
          minWidth: "40px",
          transition: "all 0.2s ease-in-out",
          "&.Mui-disabled": {
            color: "#ccc",
            borderColor: "#e0e0e0",
          },
        }}
      >
        ›
      </Button>
    );

    // 맨 마지막 페이지로 이동 버튼 (>>)
    buttons.push(
      <Button
        key="last"
        variant="outlined"
        size="small"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
        sx={{
          minWidth: "40px",
          transition: "all 0.2s ease-in-out",
          "&.Mui-disabled": {
            color: "#ccc",
            borderColor: "#e0e0e0",
          },
        }}
      >
        ≫
      </Button>
    );

    return buttons;
  };

  return (
    <div className="history-page page-contents">
      <MyHead subTitle="history" />

      <HistorySearchBox hospitals={hospitals} onSearch={handleSearch} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <table className="w-full table">
            <thead>
              <tr>
                <th
                  style={{
                    width: "50px",
                    textAlign: "center",
                    padding: "12px 8px",
                  }}
                >
                  <Checkbox
                    checked={isAllCurrentPageSelected()}
                    indeterminate={
                      isSomeCurrentPageSelected() && !isAllCurrentPageSelected()
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    size="small"
                  />
                </th>
                {tds.map((td, index) => (
                  <th
                    key={index}
                    style={{ padding: "12px 8px", textAlign: "center" }}
                  >
                    {td.key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayWorkflows.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                    }}
                  >
                    {langFile[lang].HISTORY_TABLE_NO_DATA}
                  </td>
                </tr>
              ) : (
                displayWorkflows.map((workflow, idx) => (
                  <tr
                    key={workflow.w_idx}
                    style={{
                      backgroundColor: selectedWorkflows.includes(
                        workflow.w_idx
                      )
                        ? "rgba(25, 118, 210, 0.08)"
                        : "transparent",
                      transition: "background-color 0.2s ease-in-out",
                    }}
                  >
                    <td style={{ textAlign: "center", padding: "12px 8px" }}>
                      <Checkbox
                        checked={selectedWorkflows.includes(workflow.w_idx)}
                        onChange={(e) =>
                          handleWorkflowSelect(workflow.w_idx, e.target.checked)
                        }
                        size="small"
                      />
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {workflow.o_idx === userInfo.o_idx
                        ? // o_idx가 동일한 경우: doctor1을 doctor로 표시
                          lang === "ko"
                          ? workflow.doctor1_name_kor ||
                            langFile[lang].HISTORY_TABLE_DONT_KNOW
                          : workflow.doctor1_name_eng ||
                            langFile[lang].HISTORY_TABLE_DONT_KNOW
                        : // doctor2_idx가 동일한 경우: doctor2를 doctor로 표시
                        lang === "ko"
                        ? workflow.doctor2_name_kor ||
                          langFile[lang].HISTORY_TABLE_DONT_KNOW
                        : workflow.doctor2_name_eng ||
                          langFile[lang].HISTORY_TABLE_DONT_KNOW}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {workflow.o_idx === userInfo.o_idx
                        ? // o_idx가 동일한 경우: doctor1의 진료과 (medical_dept)
                          (() => {
                            const doctor1 = workflow.doctor1_idx
                              ? userCache.get(workflow.doctor1_idx)
                              : null;
                            return getMedicalDeptName(doctor1?.medical_dept);
                          })()
                        : // doctor2_idx가 동일한 경우: doctor2의 진료과 (medical_dept)
                          (() => {
                            const doctor2 = workflow.doctor2_idx
                              ? userCache.get(workflow.doctor2_idx)
                              : null;
                            return getMedicalDeptName(doctor2?.medical_dept);
                          })()}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {workflow.o_idx === userInfo.o_idx
                        ? // o_idx가 동일한 경우: doctor2를 co-doctor로 표시
                          lang === "ko"
                          ? workflow.doctor2_name_kor ||
                            langFile[lang].HISTORY_TABLE_DONT_KNOW
                          : workflow.doctor2_name_eng ||
                            langFile[lang].HISTORY_TABLE_DONT_KNOW
                        : // doctor2_idx가 동일한 경우: doctor1을 co-doctor로 표시
                        lang === "ko"
                        ? workflow.doctor1_name_kor ||
                          langFile[lang].HISTORY_TABLE_DONT_KNOW
                        : workflow.doctor1_name_eng ||
                          langFile[lang].HISTORY_TABLE_DONT_KNOW}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {workflow.o_idx === userInfo.o_idx
                        ? // o_idx가 동일한 경우: doctor2의 진료과 (medical_dept)
                          (() => {
                            const doctor2 = workflow.doctor2_idx
                              ? userCache.get(workflow.doctor2_idx)
                              : null;
                            return getMedicalDeptName(doctor2?.medical_dept);
                          })()
                        : // doctor2_idx가 동일한 경우: doctor1의 진료과 (medical_dept)
                          (() => {
                            const doctor1 = workflow.doctor1_idx
                              ? userCache.get(workflow.doctor1_idx)
                              : null;
                            return getMedicalDeptName(doctor1?.medical_dept);
                          })()}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {(() => {
                        // workflow의 o_idx 기준으로 병원명 표시
                        const org = orgCache.get(workflow.o_idx);
                        if (org) {
                          return lang === "ko"
                            ? org.o_name_kor || org.o_name_eng || "알 수 없음"
                            : org.o_name_eng || org.o_name_kor || "알 수 없음";
                        }
                        return "알 수 없음";
                      })()}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {(() => {
                        // 무조건 workflow의 o_idx 기준으로 국가 표시
                        const org = orgCache.get(workflow.o_idx);
                        return (
                          org?.country || langFile[lang].HISTORY_TABLE_DONT_KNOW
                        );
                      })()}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {(() => {
                        const patientSerialNo = patientCache.get(
                          workflow.p_idx
                        );
                        return patientSerialNo || "-";
                      })()}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {getStatusText(workflow)}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      {workflow.te_date
                        ? dayjs(workflow.te_date).format("YYYY-MM-DD")
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 및 엑셀 다운로드 */}
          {totalPages > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                mb: 2,
                position: "relative",
              }}
            >
              {/* 페이지네이션 버튼들 - 중앙 정렬 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {renderPaginationButtons()}
              </Box>

              {/* 엑셀 다운로드 버튼 - 절대 위치로 오른쪽에 고정 */}
              <Button
                variant="contained"
                onClick={handleExcelDownload}
                disabled={selectedWorkflows.length === 0}
                sx={{
                  position: "absolute",
                  right: 0,
                  backgroundColor:
                    selectedWorkflows.length > 0 ? "#28a745" : "#ccc",
                  "&:hover": {
                    backgroundColor:
                      selectedWorkflows.length > 0 ? "#218838" : "#ccc",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#ccc",
                    color: "#999",
                  },
                }}
              >
                엑셀 다운로드 ({selectedWorkflows.length})
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
  );
}

HistoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function getTableHeadData(lang: LangType) {
  const tds: TableHeadCol[] = [
    {
      key: langFile[lang].HISTORY_TABLE_NO,
      valueType: "id",
      type: "text",
    },
    {
      key: langFile[lang].HISTORY_TABLE_DOCTOR,
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].HISTORY_TABLE_DEPARTMENT,
      valueType: "body",
      type: "text",
    },
    {
      key: langFile[lang].HISTORY_TABLE_CO_DOCTOR,
      valueType: "name",
      type: "text",
    },
    {
      key: langFile[lang].HISTORY_TABLE_CO_DEPARTMENT,
      valueType: "body",
      type: "text",
    },
    {
      key: langFile[lang].HISTORY_TABLE_HOSPITAL,
      valueType: "organization",
      type: "text",
    },
    {
      key: langFile[lang].HISTORY_TABLE_COUNTRY,
      valueType: "country",
      type: "text",
    },
    {
      key: langFile[lang].HISTORY_TABLE_PATIENT_ID,
      valueType: "number",
      type: "text",
    },
    {
      key: langFile[lang].HISTORY_TABLE_STATUS,
      valueType: "body",
      type: "text",
    },
    {
      key: langFile[lang].HISTORY_TABLE_TELE_DATE,
      valueType: "date",
      type: "text",
    },
  ];
  return tds;
}
