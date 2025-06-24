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
import { getPatientBySerialNo, getPatients } from "@/data/patient";
import { log } from "console";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import langFile from "@/lang";
import PatientInfoLayout from "./PatientInfoLayout";
import { registPreliminary } from "@/data/preliminary";
// import './PaperWeightLayout.css'; // 스타일 파일 (필요시)

// 새로운 타입 정의
export type InputComponentProps = {
  value: string | string[]; // 문자열 또는 문자열 배열을 받을 수 있도록 수정
  onChange: (value: string | string[]) => void; // 마찬가지로 수정
  onKeyDown: (event: React.KeyboardEvent) => void; // 모든 HTMLInputElement에 적용 가능하도록 KeyboardEvent로 변경
  // 필요에 따라 추가적인 props (예: placeholder, disabled 등)를 여기에 정의할 수 있습니다.
  validate?: (value: any) => boolean; // validate는 다양한 타입을 받을 수 있으므로 any 유지
  helperText?: Record<LangType, string>;
  placeholder?: Record<LangType, string>;
  lang: LangType;
};

export type SlideContent = {
  id: number | string;
  questionKey: string; // 이제 모든 항목에 대해 고유한 questionKey가 필수라고 가정
  title?: Record<LangType, string>; // 페이지 전체 제목이 아니라 개별 항목의 제목이 될 수 있음
  content?: Record<LangType, string>;
  inputComponent?: (props: InputComponentProps) => React.ReactNode;
  validate?: (value: any) => boolean;
  isSummary?: boolean; // isSummary는 페이지 레벨이 아니라, 페이지의 마지막 항목에만 의미가 있을 수 있음. 또는 페이지 전체가 요약일 수도 있음. 여기서는 항목 레벨로 유지.
  isPass?: boolean;
  isValidate?: boolean;
  passText?: Record<LangType, string>;
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
  const [patientInfo, setPatientInfo] = useState<MobilePatient | null>(null);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    visible: false,
    key: 0,
  });
  const { lang, setLang } = useContext(LanguageContext);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    console.log("answers >", answers);
    const patient = (await getPatientBySerialNo(
      answers["patientNum"],
      answers["patientBirth"]
    )) as MobilePatient;
    if (patient) {
      console.log("patient >", patient);
      openPatientInfo(patient);
      return;
    }

    showToast(langFile[lang].MOBILE_PRELIMINARY_PATIENT_NUMBER_ERROR);
  };
  // isQuestionAnswered 로직 수정: pageIndex를 받고, 해당 페이지의 모든 항목을 검사
  const isPageValid = (pageIndex: number): boolean => {
    const pageItems = slidesContent[pageIndex];
    if (!pageItems) return false; // 페이지 자체가 없는 경우

    for (const item of pageItems) {
      if (item.isSummary || !item.inputComponent) {
        // 요약 항목이거나 입력 컴포넌트가 없으면 해당 항목은 통과
        continue;
      }

      const answer = answers[item.questionKey]; // questionKey로 답변 접근

      // isValidate가 true인 경우에만 검증 수행
      if (item.isValidate) {
        if (item.validate) {
          if (!item.validate(answer)) return false; // validate 함수 실패 시 페이지 전체 실패
        } else {
          // validate 함수 없고 inputComponent만 있다면, 기본 "값이 있는지" 여부로 판단
          if (answer === undefined) return false; // undefined는 항상 실패
          if (typeof answer === "string" && answer.trim() === "") return false; // 문자열인데 비었으면 실패
          if (Array.isArray(answer) && answer.length === 0) return false; // 배열인데 비었으면 실패
        }
      }
    }
    return true; // 모든 항목 통과 시 페이지 유효
  };

  const openPatientInfo = (patient: MobilePatient) => {
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

  // next 함수: isPageValid(currentPageIndex) 사용
  const next = () => {
    console.log(answers);
    if (!isPageValid(currentPageIndex)) {
      showToast(langFile[lang].MOBILE_PRELIMINARY_ALL_REQUIRED_ERROR);
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

  const submitPreliminary = async () => {
    console.log(answers);
    const preliminary: Preliminary = {
      p_idx: patientInfo?.p_idx || 0,
      p_serial_no: answers["patientNum"] || "",
      p_birthday: answers["patientBirth"] || "",
      pl_data: {
        symptoms: answers["userSymptoms"] || [],
        pain_degree: answers["userPain"] || "",
        diagnosis: answers["userDiagnosis"] || "",
        treatment: answers["userTreatment"] || "",
        specific: answers["userSpecific"] || "",
        past_history: answers["userPastHistory"] || [],
        family_history: answers["userFamilyHistory"] || [],
        smoke: answers["userSmoke"] || "",
        drink: answers["userDrink"] || "",
        past_surgeries: answers["userPastSurgeries"] || [],
        medical_history: answers["userMedicalHistory"] || "",
        allergy: answers["userAllergy"] || [],
        todoc: answers["userTodoc"] || "",
      },
      registdate_utc: new Date(),
    };
    const res = await registPreliminary(preliminary);
    if (res === "SUCCESS") {
      showToast(langFile[lang].MOBILE_PRELIMINARY_SUCCESS);
      home();
    } else {
      showToast(langFile[lang].MOBILE_PRELIMINARY_FAIL);
    }
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
          showToast(langFile[lang].MOBILE_PRELIMINARY_ALL_REQUIRED_ERROR);
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
          
          /* 스크롤바 스타일링 */
          .slide-content-wrapper::-webkit-scrollbar {
            width: 6px;
          }
          
          .slide-content-wrapper::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .slide-content-wrapper::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
          
          .slide-content-wrapper::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
          
          /* paperweight 컨테이너 내부 스크롤 설정 */
          .paperweight-layout-container {
            -webkit-overflow-scrolling: touch; /* iOS 스크롤 부드럽게 */
          }
          
          .paperweight-layout-container .slider-main-area {
            -webkit-overflow-scrolling: touch;
          }
          
          .paperweight-layout-container .slide-content-wrapper {
            -webkit-overflow-scrolling: touch;
          }
          
          /* iOS Safe Area 지원 */
          .paperweight-layout-container .bottom-button-container {
            padding-bottom: max(35px, env(safe-area-inset-bottom)) !important;
          }
          .slick-list .slick-current {
            overflow-y: auto;
            padding-top: 130px;
          }
          
          .slick-track {
            display: flex;
            align-items: stretch;
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
          position: "relative", // 전체 컨테이너 기준점
        }}
      >
        <div
          className="slider-main-area"
          style={{
            flex: "1 1 auto", // flexGrow: 1, flexShrink: 1, flexBasis: auto
            overflowY: "hidden", // 상위 컨테이너는 스크롤 비활성화
            overflowX: "hidden", // 가로 스크롤 완전 차단
            padding: "10px 10px 0px 10px", // 하단 패딩 제거
            display: "flex",
            flexDirection: "column",
            position: "relative", // 오버레이 기준점
            minHeight: 0, // flex 아이템이 최소 컨텐츠 크기로 줄어들 수 있도록
          }}
        >
          {/* Slider는 항상 렌더링 */}
          <Slider
            ref={sliderRef}
            {...settings}
            style={{
              height: "100%",
              flex: "1 1 auto",
            }}
          >
            {slidesContent.map((pageItems, pageIndex) => (
              <div
                key={`page-${pageIndex}`} // 페이지 키
                className="slide-content-wrapper"
                style={{
                  outline: "none", // Slider 내부 div 포커스 아웃라인 제거
                  height: "calc(100dvh - 160px)", // 정확한 높이 설정
                  overflowY: "auto", // 각 슬라이드에서 스크롤 활성화
                  overflowX: "hidden",
                  scrollbarWidth: "thin", // Firefox 스크롤바
                  msOverflowStyle: "auto", // IE/Edge 스크롤바
                  WebkitOverflowScrolling: "touch", // iOS 부드러운 스크롤
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {pageItems.map((item) => (
                  <div
                    key={item.id} // 항목의 id를 키로 사용 (id가 고유해야 함)
                    className="slide-item-content"
                    style={{
                      minHeight: "100%", // 부모 높이에 맞춤
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center", // 내부 요소들 수평 중앙 정렬
                      justifyContent: "center", // 중앙 정렬로 변경
                      width: "100%",
                      maxWidth: "100%",
                      overflow: "visible", // 내용이 보이도록
                      boxSizing: "border-box",
                      paddingTop: "40px", // 상단 패딩 증가
                      paddingBottom: "40px", // 하단 여백 증가
                    }}
                  >
                    {item.title && (
                      <Typography
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1.8rem",
                          marginBottom: "15px", // 마진 줄임
                          flexShrink: 0,
                          paddingX: "20px", // 좌우 패딩 추가
                        }}
                      >
                        {item.title[lang]}
                      </Typography>
                    )}{" "}
                    {/* 항목별 제목 */}
                    {typeof item.content === "object" ? (
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{
                          whiteSpace: "pre-line",
                          lineHeight: "1.5",
                          fontWeight: "bold",
                          color: "red",
                          marginBottom: "15px", // 마진 줄임
                          flexShrink: 0,
                          paddingX: "20px", // 좌우 패딩 추가
                        }}
                      >
                        {item.content[lang]}
                      </Typography>
                    ) : (
                      ""
                    )}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minHeight: "auto", // 자동 높이
                      }}
                    >
                      {item.inputComponent &&
                        item.inputComponent({
                          value: answers[item.questionKey] || "",
                          onChange: (value) =>
                            handleItemInputChange(item.questionKey, value),
                          onKeyDown: () => {},
                          lang: lang,
                        })}
                    </div>
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
            padding: "15px 20px 20px 20px", // 패딩 조정
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderTop: "1px solid #eee",
            backgroundColor: "white", // 배경색 추가하여 내용과 구분
            boxSizing: "border-box",
            flexShrink: 0, // 상단 컨텐츠가 늘어나도 이 영역은 줄어들지 않음
            minHeight: "160px", // 최소 높이 증가
            position: "relative",
            zIndex: 10, // 다른 요소들 위에 표시
            marginBottom: "30px",
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
                submitPreliminary();
              } else {
                next();
              }
            }}
            style={{
              width: "calc(100% - 40px)", // 좌우 여백 20px씩 확보
              maxWidth: "400px",
              height: "60px",
              cursor: "pointer",
              background: "#043E68",
              color: "white",
              borderRadius: "30px",
              fontSize: "1.3rem",
            }}
          >
            {isPatientInfo
              ? langFile[lang].MOBILE_PRELIMINARY_START
              : isCurrentPageSummary ||
                slidesContent[currentPageIndex]?.[0]?.isSummary
              ? langFile[lang].MOBILE_PRELIMINARY_COMPLETE
              : langFile[lang].MOBILE_PRELIMINARY_NEXT}
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
                  width: "calc(100% - 40px)", // 좌우 여백 20px씩 확보
                  maxWidth: "400px",
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
                {langFile[lang].MOBILE_PRELIMINARY_BACK}
              </Button>
            ) : (
              <Stack
                direction="row"
                spacing={2}
                width="calc(100% - 40px)"
                maxWidth="400px"
              >
                <Button
                  className="button"
                  onClick={previous}
                  disabled={currentPageIndex === 0}
                  style={{
                    flex: 1, // 동일한 비율로 공간 분할
                    height: "60px",
                    marginTop: "10px",
                    cursor: "pointer",
                    color: "black",
                    background: "white",
                    border: "1px solid #043E68",
                    borderRadius: "30px",
                    fontSize: "1.2rem", // 폰트 크기 약간 줄임
                  }}
                >
                  {langFile[lang].MOBILE_PRELIMINARY_BACK}
                </Button>
                <Button
                  className="button"
                  onClick={pass}
                  disabled={currentPageIndex === 0}
                  style={{
                    flex: 1, // 동일한 비율로 공간 분할
                    height: "60px",
                    marginTop: "10px",
                    cursor: "pointer",
                    color: "black",
                    background: "white",
                    border: "1px solid #043E68",
                    borderRadius: "30px",
                    fontSize: "1.2rem", // 폰트 크기 약간 줄임
                  }}
                >
                  {slidesContent[currentPageIndex]?.[0]?.passText[lang] || ""}
                </Button>
              </Stack>
            )
          ) : (
            <div style={{ height: "90px" }}></div>
          )}
        </div>
      </div>
    </>
  );
}

export default PreliminaryLayout;
