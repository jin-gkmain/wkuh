import React, { useRef, useState, useEffect, useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/router";
import {
  Button,
  Grid,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import getPatients from "@/data/patient";
import { log } from "console";
import { LanguageContext } from "@/context/LanguageContext";
import langFile from "@/lang";
import PatientInfoLayout from "./PatientInfoLayout";
// import './PaperWeightLayout.css'; // 스타일 파일 (필요시)

// 새로운 타입 정의
export type InputComponentProps = {
  value: string | string[]; // 문자열 또는 문자열 배열을 받을 수 있도록 수정
  onChange: (value: string | string[]) => void; // 마찬가지로 수정
  onKeyDown: (event: React.KeyboardEvent) => void; // 모든 HTMLInputElement에 적용 가능하도록 KeyboardEvent로 변경
  // 필요에 따라 추가적인 props (예: placeholder, disabled 등)를 여기에 정의할 수 있습니다.
  validate?: (value: any) => boolean; // validate는 다양한 타입을 받을 수 있으므로 any 유지
  helperText?: string;
};

export type SlideContent = {
  id: number | string;
  questionKey: string; // 이제 모든 항목에 대해 고유한 questionKey가 필수라고 가정
  title?: string; // 페이지 전체 제목이 아니라 개별 항목의 제목이 될 수 있음
  content?: React.ReactNode;
  inputComponent?: (props: InputComponentProps) => React.ReactNode;
  validate?: (value: any) => boolean;
  isSummary?: boolean; // isSummary는 페이지 레벨이 아니라, 페이지의 마지막 항목에만 의미가 있을 수 있음. 또는 페이지 전체가 요약일 수도 있음. 여기서는 항목 레벨로 유지.
  isPass?: boolean;
  isValidate?: boolean;
  passText?: string;
};

type PreliminaryLayoutProps = {
  slidesContent: SlideContent[][];
};

// 버튼 영역의 대략적인 높이 (패딩 포함). 실제 버튼 스타일에 따라 조정 필요.
const BOTTOM_NAV_HEIGHT = 80; // px

// Toast 상태 타입
type ToastState = {
  message: string;
  visible: boolean;
  key: number; // 동일 메시지 반복 시 애니메이션 리셋을 위한 키
};

function PreliminaryLayout({ slidesContent }: PreliminaryLayoutProps) {
  const sliderRef = useRef<Slider>(null);
  const router = useRouter();
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // 이름 변경
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isPatientInfo, setIsPatientInfo] = useState(false);
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    visible: false,
    key: 0,
  });
  const { lang, setLang } = useContext(LanguageContext);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { hos } = router.query;

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, visible: true, key: Date.now() });
    toastTimerRef.current = setTimeout(() => {
      setToast({ message: "", visible: false, key: 0 });
    }, 2000); // 3초 후 토스트 숨김
  };

  const checkPatientNumber = async () => {
    const patients = (await getPatients(Number(hos), {})) as Patient[];
    for (const patient of patients) {
      console.log(answers["patientNum"], patient.p_serial_no);
      if (answers["patientNum"] === patient.p_serial_no.toString()) {
        openPatientInfo(patient);
        return;
      }
    }
    showToast("환자 번호가 올바르지 않습니다.");
  };
  // isQuestionAnswered 로직 수정: pageIndex를 받고, 해당 페이지의 모든 항목을 검사
  const isPageValid = (pageIndex: number): boolean => {
    const pageItems = slidesContent[pageIndex];
    if (!pageItems) return false; // 페이지 자체가 없는 경우
    if (!pageItems[0]?.isPass) return true;
    for (const item of pageItems) {
      if (item.isSummary || !item.inputComponent) {
        // 요약 항목이거나 입력 컴포넌트가 없으면 해당 항목은 통과
        continue;
      }

      const answer = answers[item.questionKey]; // questionKey로 답변 접근

      if (item.validate) {
        if (!item.validate(answer)) return false; // validate 함수 실패 시 페이지 전체 실패
      } else {
        // validate 함수 없고 inputComponent만 있다면, 기본 "값이 있는지" 여부로 판단
        if (answer === undefined) return false; // undefined는 항상 실패
        if (typeof answer === "string" && answer.trim() === "") return false; // 문자열인데 비었으면 실패
        if (Array.isArray(answer) && answer.length === 0) return false; // 배열인데 비었으면 실패
      }
    }
    return true; // 모든 항목 통과 시 페이지 유효
  };

  const openPatientInfo = (patient: Patient) => {
    setIsPatientInfo(true);
    setPatientInfo(patient);
  };

  const closePatientInfo = () => {
    setIsPatientInfo(false);
    next();
  };

  // handleInputChange 수정: pageIndex, itemIndex 대신 questionKey 직접 사용
  const handleItemInputChange = (questionKey: string, value: any) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionKey]: value,
    }));
    // 입력 시 토스트 메시지 자동 해제 로직은 showToast의 자동 숨김으로 대체
  };

  // handleKeyDown 수정: pageIndex, itemIndex 대신 현재 페이지 유효성 검사 후 next()
  const handleItemKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // 현재 페이지의 모든 항목에 대해 Enter키 누를 시 next() 호출 시도
      // (단, focus된 input이 속한 페이지가 currentPageIndex와 일치할 때만)
      // 이 부분은 복잡해질 수 있어, 개별 input의 onKeyDown에서 직접 next()를 부르는게 더 직관적일 수 있음.
      // 여기서는 일단 현재 페이지가 유효하면 next() 호출하도록 단순화.
      if (isPageValid(currentPageIndex)) {
        // next(); // Enter로 다음 넘어가는 기능은 유지하되, 어느 입력에서든 마지막 입력처럼 동작할 위험. 개별 컴포넌트가 next를 직접 호출하게 할 수도.
      } // UX를 고려하여 Enter키 동작은 좀 더 세밀한 조정이 필요할 수 있습니다.
    }
  };

  // next 함수: isPageValid(currentPageIndex) 사용
  const next = () => {
    console.log(answers);
    if (!isPageValid(currentPageIndex)) {
      showToast("현재 페이지의 모든 필수 항목을 올바르게 입력해주세요.");
      return;
    }
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const home = () => {
    router.back(); // 또는 특정 경로로 이동 router.push('/');
  };

  const pass = () => {
    if (sliderRef.current) {
      answers[slidesContent[currentPageIndex - 1]?.[0]?.questionKey] =
        slidesContent[currentPageIndex - 1]?.[0]?.passText || "없음";
      sliderRef.current.slickNext();
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: false, // true로 바꾸지 마
    beforeChange: (oldPageIndex: number, newPageIndex: number) => {
      if (newPageIndex > oldPageIndex) {
        if (!isPageValid(oldPageIndex)) {
          showToast("현재 페이지의 모든 필수 항목을 올바르게 입력해주세요.");
          setTimeout(() => {
            if (sliderRef.current) {
              sliderRef.current.slickGoTo(oldPageIndex, true);
            }
          }, 0);
          return;
        }
      }
    },
    afterChange: (current: number) => {
      setCurrentPageIndex(current); // 이름 변경된 상태 업데이트 함수 사용
    },
  };

  if (!slidesContent || slidesContent.length === 0) {
    return <div style={{ padding: "20px" }}>설문 내용이 없습니다.</div>;
  }

  // 현재 페이지의 모든 항목이 isSummary인지 확인 (다음 버튼 텍스트 용도)
  const isCurrentPageSummary = slidesContent[currentPageIndex]?.every(
    (item) => item.isSummary === true
  );

  return (
    <>
      {toast.visible && (
        <div
          key={toast.key} // 애니메이션 리셋용
          style={{
            position: "fixed",
            bottom: `${BOTTOM_NAV_HEIGHT + 30}px`, // 버튼 영역 바로 위에 표시
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.75)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: 1000,
            fontSize: "0.9em",
            // 애니메이션 수정: toastFadeOut 지연시간을 2.5s -> 1.0s 로 변경
            animation: "toastFadeIn 0.5s, toastFadeOut 0.5s 1.0s forwards",
          }}
        >
          {toast.message}
        </div>
      )}
      <style>
        {`
          @keyframes toastFadeIn {
            from { opacity: 0; transform: translate(-50%, 10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          @keyframes toastFadeOut {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, 10px); }
          }
        `}
      </style>

      <div
        className="paperweight-layout-container"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh", // vh -> dvh
          maxHeight: "100dvh", // vh -> dvh
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          className="slider-main-area"
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            position: "relative", // 오버레이 기준점
          }}
        >
          {/* Slider는 항상 렌더링 */}
          <Slider ref={sliderRef} {...settings} style={{ height: "100%" }}>
            {slidesContent.map((pageItems, pageIndex) => (
              <div
                key={`page-${pageIndex}`} // 페이지 키
                className="slide-content-wrapper"
                style={{
                  outline: "none", // Slider 내부 div 포커스 아웃라인 제거
                }}
              >
                {pageItems.map((item) => (
                  <div
                    key={item.id} // 항목의 id를 키로 사용 (id가 고유해야 함)
                    className="slide-item-content"
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center", // 내부 요소들 수평 중앙 정렬
                      overflowX: "scroll",
                    }}
                  >
                    <div style={{ height: "40px" }}></div>
                    {item.title && (
                      <Typography
                        align="center"
                        sx={{ fontWeight: "bold", fontSize: "1.8rem" }}
                      >
                        {item.title}
                      </Typography>
                    )}{" "}
                    {/* 항목별 제목 */}
                    {typeof item.content === "string" ? (
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{
                          whiteSpace: "pre-line",
                          lineHeight: "1.5",
                          fontWeight: "bold",
                          color: "red",
                        }}
                      >
                        {item.content}
                      </Typography>
                    ) : (
                      item.content
                    )}
                    {item.inputComponent &&
                      item.inputComponent({
                        value: answers[item.questionKey] || "",
                        onChange: (value) =>
                          handleItemInputChange(item.questionKey, value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            next();
                          }
                        },
                      })}
                    <div style={{ height: "40px" }}></div>
                  </div>
                ))}
              </div>
            ))}
          </Slider>

          {/* isPatientInfo가 true일 때 오버레이 표시 */}
          {isPatientInfo && (
            <PatientInfoLayout patientInfo={patientInfo} lang={lang} />
          )}
        </div>

        <div
          className="bottom-button-container"
          style={{
            padding: "20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderTop: "1px solid #eee",
            backgroundColor: "white", // 배경색 추가하여 내용과 구분
            // position: "fixed", // 이 방법 대신 flex-shrink:0 와 전체 flex 구조 활용
            // bottom: 0,
            // left: 0,
            // width: "100%",
            boxSizing: "border-box",
            flexShrink: 0, // 상단 컨텐츠가 늘어나도 이 영역은 줄어들지 않음
          }}
        >
          <Button
            className="button"
            onClick={() => {
              if (isPatientInfo) {
                closePatientInfo();
              } else if (currentPageIndex === 0) {
                checkPatientNumber();
              } else if (
                isCurrentPageSummary ||
                slidesContent[currentPageIndex]?.[0]?.isSummary
              ) {
                home();
              } else {
                next();
              }
            }}
            style={{
              width: "85%",
              height: "60px",
              cursor: "pointer",
              background: "#043E68",
              color: "white",
              borderRadius: "30px",
              fontSize: "1.3rem",
            }}
          >
            {isPatientInfo
              ? "시작하기"
              : isCurrentPageSummary ||
                slidesContent[currentPageIndex]?.[0]?.isSummary
              ? "완료"
              : "다음"}
          </Button>
          {!(
            isCurrentPageSummary ||
            slidesContent[currentPageIndex]?.[0]?.isSummary ||
            currentPageIndex === 0
          ) ? (
            slidesContent[currentPageIndex]?.[0]?.isPass ? (
              <Button
                className="button"
                onClick={previous}
                disabled={currentPageIndex === 0}
                style={{
                  width: "85%",
                  height: "60px",
                  marginTop: "10px",
                  cursor: "pointer",
                  color: "black",
                  background: "white",
                  border: "1px solid #043E68",
                  borderRadius: "30px",
                  fontSize: "1.3rem",
                }}
              >
                이전
              </Button>
            ) : (
              <Stack direction="row" spacing={2} width="85%">
                <Button
                  className="button"
                  onClick={previous}
                  disabled={currentPageIndex === 0}
                  style={{
                    width: "50%",
                    height: "60px",
                    marginTop: "10px",
                    cursor: "pointer",
                    color: "black",
                    background: "white",
                    border: "1px solid #043E68",
                    borderRadius: "30px",
                    fontSize: "1.3rem",
                  }}
                >
                  이전
                </Button>
                <Button
                  className="button"
                  onClick={pass}
                  disabled={currentPageIndex === 0}
                  style={{
                    width: "50%",
                    height: "60px",
                    marginTop: "10px",
                    cursor: "pointer",
                    color: "black",
                    background: "white",
                    border: "1px solid #043E68",
                    borderRadius: "30px",
                    fontSize: "1.3rem",
                  }}
                >
                  {slidesContent[currentPageIndex]?.[0]?.passText || "없음"}
                </Button>
              </Stack>
            )
          ) : (
            <div style={{ height: "70px" }}></div>
          )}
        </div>
      </div>
    </>
  );
}

export default PreliminaryLayout;
