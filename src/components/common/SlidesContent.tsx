import React, { useState, useEffect, useContext } from "react";
import {
  SlideContent,
  InputComponentProps,
} from "../pages/mobile/preliminary/PreliminaryLayout"; // 경로가 정확한지 확인해주세요.
import { Button, Slider, Stack, TextField } from "@mui/material";
import langFile, { getAllValuesForConstantKeyAsDict } from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";

const commonInputStyles: React.CSSProperties = {
  marginTop: "20px", // 마진 줄임
  boxSizing: "border-box",
  width: "90%", // 화면에 맞게 어느정도 늘어나도록
  maxWidth: "400px", // 최대 너비 증가
};

const commonInputPropsSx = {
  "&::placeholder": {
    color: "#C4C4C4", // Placeholder 색상 변경
    opacity: 1, // Placeholder 불투명도
  },
  "& .MuiInput-root": {
    fontWeight: "bold",
  },
  // MuiInput-input 클래스를 타겟팅하여 내부 input 요소의 패딩 조절
  "& .MuiInput-input": {
    paddingTop: "8px", // 상단 패딩
    paddingBottom: "8px", // 하단 패딩
    paddingLeft: "0px", // 좌측 패딩 (기본 StandardInput은 underline이므로 좌측 패딩은 거의 없음)
    paddingRight: "0px", // 우측 패딩
    // 필요하다면 height도 조절할 수 있습니다.
    // height: '24px',
  },
};

// 예시 입력 컴포넌트들 (실제로는 별도 파일로 분리하거나 PaperWeightLayout 근처에 정의할 수 있습니다)
const MyTextInput = ({
  value,
  onChange,
  onKeyDown,
  validate,
  helperText,
  placeholder,
  lang,
}: InputComponentProps) => (
  <TextField
    error={validate && !validate(value) && value.length > 0}
    helperText={
      validate && !validate(value) && value.length > 0 ? helperText[lang] : ""
    }
    type="text"
    value={value}
    variant="standard"
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    placeholder={placeholder[lang] || ""}
    style={commonInputStyles}
    slotProps={{
      input: {
        sx: commonInputPropsSx,
      },
    }}
  />
);

const MyNumberInput = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  validate,
  helperText,
  lang,
}: InputComponentProps) => (
  <TextField
    error={validate && !validate(value) && value.length > 0}
    helperText={
      validate && !validate(value) && value.length > 0 ? helperText[lang] : ""
    }
    type="number"
    value={value}
    variant="standard"
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    placeholder={placeholder[lang] || ""}
    style={commonInputStyles}
    slotProps={{
      input: {
        sx: commonInputPropsSx,
      },
    }}
  />
);

const MyTextArea = ({
  value,
  onChange,
  placeholder,
  validate,
  helperText,
  lang,
}: Omit<InputComponentProps, "onKeyDown">) => (
  <TextField
    error={validate && !validate(value) && value.length > 0}
    helperText={
      validate && !validate(value) && value.length > 0 ? helperText[lang] : ""
    }
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder[lang] || ""}
    multiline
    rows={5}
    variant="outlined"
    style={commonInputStyles}
    slotProps={{
      input: {
        sx: {
          borderRadius: "20px",
          height: "150px",
          ...commonInputPropsSx, // 공통 스타일 적용
          // TextArea는 내부 input(textarea)의 패딩이 다를 수 있으므로 필요시 오버라이드
          "& .MuiInput-input": {
            height: "150px",
            paddingTop: "8px",
            paddingBottom: "8px",
            // paddingLeft, paddingRight는 multiline의 경우 일반적으로 0이거나 작음
            // 필요에 따라 height 대신 minHeight/maxHeight 사용 고려
          },
        },
      },
    }}
  />
);

const MySliderInput = ({
  value,
  onChange,
  placeholder,
  validate,
  helperText,
  lang,
}: InputComponentProps) => {
  const marks = [
    {
      value: 0,
      label: "0 " + langFile[lang].MOBILE_PRELIMINARY_PAIN_DEGREE1,
    },
    {
      value: 10,
      label: "1",
    },
    {
      value: 20,
      label: "2",
    },
    {
      value: 29,
      label: "3",
    },
    {
      value: 38,
      label: "4",
    },
    {
      value: 48,
      label: "5 " + langFile[lang].MOBILE_PRELIMINARY_PAIN_DEGREE2,
    },
    {
      value: 57,
      label: "6",
    },
    {
      value: 67,
      label: "7",
    },
    {
      value: 76,
      label: "8",
    },
    {
      value: 86,
      label: "9",
    },
    {
      value: 96,
      label: "10 " + langFile[lang].MOBILE_PRELIMINARY_PAIN_DEGREE3,
    },
  ];
  function valuetext(value: number) {
    return `${value}`;
  }
  return (
    <Stack
      direction="row"
      sx={{
        height: "300px",
        marginTop: "20px", // 마진 줄임
        width: "60%",
        maxWidth: "250px",
      }}
      spacing={2}
    >
      <Slider
        aria-label="Custom marks"
        defaultValue={0}
        size="medium"
        orientation="vertical"
        getAriaValueText={valuetext}
        step={10}
        marks={marks}
        onChange={(e, value) => onChange(value.toString())}
        sx={{
          "& .MuiSlider-mark": {
            width: "0px",
            height: "0px",
          },
          "& .MuiSlider-rail": {
            width: "30px",
            backgroundColor: "grey", // 필요시 색상 변경
          },
          // 트랙 (값이 채워지는 부분)의 높이 조절
          "& .MuiSlider-track": {
            width: "30px",
            // backgroundColor: 'blue', // 필요시 색상 변경
          },
          // Thumb (핸들)의 크기 및 모양 조절
          "& .MuiSlider-thumb": {
            width: "35px", // Thumb 너비
            height: "35px", // Thumb 높이
            // backgroundColor: 'lightblue', // 필요시 색상 변경
            // 트랙 위에 Thumb이 자연스럽게 올라오도록 margin 조절
            // marginTop: '-6px', // (Thumb 높이 - 트랙 높이) / 2 의 음수값 정도
          },
          "& .MuiSlider-markLabel": {
            marginLeft: "10px",
            fontSize: "1rem",
          },
          "& .MuiSlider-markActive": {
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
};

// MyButtonGroup Props 타입 정의
// InputComponentProps에서 onKeyDown만 가져오고, value와 onChange는 커스텀하게 정의합니다.
type MyButtonGroupProps = {
  options: {
    id: string;
    label: Record<string, string>;
    type: "button" | "etc";
  }[];
  value: string; // 선택된 옵션 상태를 나타내는 JSON 문자열 e.g., {"sym1": true, "sym11": "기타 증상"}
  onChange: (value: string) => void; // 변경된 상태 객체를 JSON 문자열로 전달
  onKeyDown?: (event: React.KeyboardEvent) => void; // onKeyDown은 옵셔널하게 유지
  lang: string;
  isOneLine?: boolean; // 버튼을 한줄로 보여줄지
  placeholder?: Record<string, string>;
};

const MyButtonGroup = ({
  options,
  value, // JSON string from props
  onChange,
  onKeyDown,
  lang,
  placeholder,
  isOneLine = false,
}: MyButtonGroupProps) => {
  // 내부 상태는 객체로 관리
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<{
    [id: string]: boolean | string;
  }>({});

  // props.value (JSON 문자열)가 변경되면 내부 상태 업데이트
  useEffect(() => {
    try {
      const parsedValue = JSON.parse(value || "{}");
      setSelectedOptionsMap(parsedValue);
    } catch (error) {
      console.error("Error parsing value in MyButtonGroup:", error);
      setSelectedOptionsMap({});
    }
  }, [value]);

  const handleChange = (updatedMap: { [id: string]: boolean | string }) => {
    setSelectedOptionsMap(updatedMap);
    onChange(JSON.stringify(updatedMap));
  };

  const handleButtonClick = (optionId: string, type: "button" | "etc") => {
    const newSelectedOptionsMap = { ...selectedOptionsMap };
    if (type === "button") {
      if (newSelectedOptionsMap[optionId]) {
        delete newSelectedOptionsMap[optionId];
      } else {
        newSelectedOptionsMap[optionId] = true;
      }
    } else if (type === "etc") {
      if (typeof newSelectedOptionsMap[optionId] === "string") {
        // 이미 etc가 선택되어 텍스트 입력 중이거나 입력된 상태
        delete newSelectedOptionsMap[optionId]; // 선택 해제
      } else {
        newSelectedOptionsMap[optionId] = ""; // etc 선택, 빈 문자열로 초기화
      }
    }
    handleChange(newSelectedOptionsMap);
  };

  const handleTextFieldChange = (optionId: string, text: string) => {
    const newSelectedOptionsMap = { ...selectedOptionsMap };
    newSelectedOptionsMap[optionId] = text;
    handleChange(newSelectedOptionsMap);
  };

  return (
    <div style={{ marginTop: "30px", width: "90%", maxWidth: "400px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isOneLine ? "1fr" : "1fr 1fr",
          gap: "10px",
          alignItems: "stretch", // 같은 행의 아이템들이 같은 높이를 가지도록 함
        }}
      >
        {options.map((option) => {
          const isEtcSelectedAndVisible =
            option.type === "etc" &&
            typeof selectedOptionsMap[option.id] === "string";
          const occupiesFullRow = isEtcSelectedAndVisible && !isOneLine;

          return (
            <div
              key={option.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                ...(occupiesFullRow && { gridColumn: "1 / -1" }),
              }}
            >
              <Button
                onClick={() => handleButtonClick(option.id, option.type)}
                onKeyDown={onKeyDown}
                sx={{
                  padding: "15px 10px",
                  fontSize: "1.3rem",
                  borderRadius: "25px",
                  border:
                    selectedOptionsMap[option.id] === true ||
                    typeof selectedOptionsMap[option.id] === "string"
                      ? "1px solid #043E68"
                      : "1px solid #7AB5F3",
                  backgroundColor:
                    selectedOptionsMap[option.id] === true ||
                    typeof selectedOptionsMap[option.id] === "string"
                      ? "#043E68"
                      : "white",
                  color:
                    selectedOptionsMap[option.id] === true ||
                    typeof selectedOptionsMap[option.id] === "string"
                      ? "white"
                      : "#7AB5F3",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: "bold",
                  minHeight: "60px",
                  height: "100%", // 컨테이너 높이에 맞춤
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%", // 버튼 너비 강제
                  whiteSpace: "normal", // 텍스트 줄바꿈 허용
                  wordBreak: "keep-all", // 한글 단어 단위로 줄바꿈
                }}
              >
                {option.label[lang]}
              </Button>
              {isEtcSelectedAndVisible && (
                <TextField
                  variant="outlined" // 사용자가 변경한 variant 유지
                  fullWidth
                  placeholder={placeholder?.[lang] || ""}
                  value={selectedOptionsMap[option.id] as string} // 이미 string으로 확인됨
                  onChange={(e) =>
                    handleTextFieldChange(option.id, e.target.value)
                  }
                  style={{
                    ...commonInputStyles,
                    marginTop: "5px",
                    width: "100%",
                    borderRadius: "20px",
                  }}
                  slotProps={{
                    input: {
                      sx: {
                        ...commonInputPropsSx,
                        borderRadius: "20px",
                      },
                    },
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// MySelectButtonGroup Props 타입 정의
type MySelectButtonGroupProps = {
  options: { id: string; label: Record<string, string> }[]; // etc 타입은 우선 제외, 필요시 추가
  value: string | null; // 선택된 단일 옵션의 ID 또는 null
  onChange: (selectedId: string | null) => void; // 변경된 단일 ID 또는 null을 전달
  onKeyDown?: (event: React.KeyboardEvent) => void;
  lang: string;
  isOneLine?: boolean;
};

const MySelectButtonGroup = ({
  options,
  value: selectedOption,
  onChange,
  onKeyDown,
  lang,
  isOneLine = false,
}: MySelectButtonGroupProps) => {
  const handleButtonClick = (optionId: string) => {
    if (selectedOption === optionId) {
      onChange(null); // 이미 선택된 버튼 클릭 시 선택 해제
    } else {
      onChange(optionId); // 새로운 버튼 선택
    }
  };

  return (
    <div style={{ marginTop: "30px", width: "90%", maxWidth: "400px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isOneLine ? "1fr" : "1fr 1fr",
          gap: "10px",
          alignItems: "stretch", // 같은 행의 아이템들이 같은 높이를 가지도록 함
        }}
      >
        {options.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleButtonClick(option.id)}
            onKeyDown={onKeyDown}
            sx={{
              padding: "15px 10px",
              fontSize: "1.3rem",
              borderRadius: "25px",
              border:
                selectedOption === option.id
                  ? "1px solid #043E68"
                  : "1px solid #7AB5F3",
              backgroundColor:
                selectedOption === option.id ? "#043E68" : "white",
              color: selectedOption === option.id ? "white" : "#7AB5F3",
              cursor: "pointer",
              textAlign: "center",
              fontWeight: "bold",
              minHeight: "60px",
              height: "100%", // 컨테이너 높이에 맞춤
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "normal", // 텍스트 줄바꿈 허용
              wordBreak: "keep-all", // 한글 단어 단위로 줄바꿈
            }}
          >
            {option.label[lang]}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Options for MyButtonGroup instances
const symptomsOptions = [
  {
    id: "sym1",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE1"
    ),
    type: "button" as const,
  },
  {
    id: "sym2",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE2"
    ),
    type: "button" as const,
  },
  {
    id: "sym3",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE3"
    ),
    type: "button" as const,
  },
  {
    id: "sym4",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE4"
    ),
    type: "button" as const,
  },
  {
    id: "sym5",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE5"
    ),
    type: "button" as const,
  },
  {
    id: "sym6",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE6"
    ),
    type: "button" as const,
  },
  {
    id: "sym7",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE7"
    ),
    type: "button" as const,
  },
  {
    id: "sym8",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE8"
    ),
    type: "button" as const,
  },
  {
    id: "sym9",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE9"
    ),
    type: "button" as const,
  },
  {
    id: "sym10",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_TITLE10"
    ),
    type: "button" as const,
  },
  {
    id: "sym11",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SYMPTOMS_NOT_SURE"
    ),
    type: "etc" as const,
  },
];

const pastHistoryOptions = [
  {
    id: "past1",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_HISTORY_TITLE1"
    ),
    type: "button" as const,
  },
  {
    id: "past2",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_HISTORY_TITLE2"
    ),
    type: "button" as const,
  },
  {
    id: "past3",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_HISTORY_TITLE3"
    ),
    type: "button" as const,
  },
  {
    id: "past4",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_HISTORY_TITLE4"
    ),
    type: "button" as const,
  },
  {
    id: "past5",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_HISTORY_TITLE5"
    ),
    type: "etc" as const,
  },
];

const familyHistoryOptions = [
  {
    id: "family1",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_FAMILY_HISTORY_TITLE1"
    ),
    type: "button" as const,
  },
  {
    id: "family2",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_FAMILY_HISTORY_TITLE2"
    ),
    type: "button" as const,
  },
  {
    id: "family3",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_FAMILY_HISTORY_TITLE3"
    ),
    type: "button" as const,
  },
  {
    id: "family4",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_FAMILY_HISTORY_TITLE4"
    ),
    type: "button" as const,
  },
  {
    id: "family5",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_FAMILY_HISTORY_TITLE5"
    ),
    type: "etc" as const,
  },
];

const smokeOptions = [
  {
    id: "smoke1",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SMOKE_YES"
    ),
    type: "button" as const,
  },
  {
    id: "smoke2",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SMOKE_NO"
    ),
    type: "button" as const,
  },
  {
    id: "smoke3",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_SMOKE_NOT_NOW"
    ),
    type: "button" as const,
  },
];

const drinkOptions = [
  {
    id: "drink1",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_DRINK_YES"
    ),
    type: "button" as const,
  },
  {
    id: "drink2",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_DRINK_NO"
    ),
    type: "button" as const,
  },
  {
    id: "drink3",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_DRINK_NOT_NOW"
    ),
    type: "button" as const,
  },
];

const pastSurgeriesOptions = [
  {
    id: "pastSurgery1",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_SURGERIES_TITLE1"
    ),
    type: "button" as const,
  },
  {
    id: "pastSurgery2",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_SURGERIES_TITLE2"
    ),
    type: "button" as const,
  },
  {
    id: "pastSurgery3",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_SURGERIES_TITLE3"
    ),
    type: "button" as const,
  },
  {
    id: "pastSurgery4",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_SURGERIES_TITLE4"
    ),
    type: "button" as const,
  },
  {
    id: "pastSurgery6",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_SURGERIES_TITLE6"
    ),
    type: "button" as const,
  },
  {
    id: "pastSurgery7",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_PAST_SURGERIES_TITLE7"
    ),
    type: "etc" as const,
  },
];

const allergyOptions = [
  {
    id: "allergy1",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_ALLERGY_TITLE1"
    ),
    type: "button" as const,
  },
  {
    id: "allergy2",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_ALLERGY_TITLE2"
    ),
    type: "button" as const,
  },
  {
    id: "allergy3",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_ALLERGY_TITLE3"
    ),
    type: "button" as const,
  },
  {
    id: "allergy4",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_ALLERGY_TITLE4"
    ),
    type: "button" as const,
  },
  {
    id: "allergy5",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_ALLERGY_TITLE5"
    ),
    type: "button" as const,
  },
  {
    id: "allergy6",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_ALLERGY_TITLE6"
    ),
    type: "button" as const,
  },
  {
    id: "allergy7",
    label: getAllValuesForConstantKeyAsDict(
      langFile,
      "MOBILE_PRELIMINARY_ALLERGY_TITLE7"
    ),
    type: "etc" as const,
  },
];

export const testSlides: SlideContent[][] = [
  [
    {
      id: "patientNumQuestion",
      questionKey: "patientNum",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_PATIENNUM_DESC"
      ),
      inputComponent: (props) => (
        <MyTextInput
          {...props}
          placeholder={getAllValuesForConstantKeyAsDict(
            langFile,
            "MOBILE_PRELIMINARY_PATIENNUM_INPUT_PLACEHOLDER"
          )}
          // validate={(value) => value.trim().length === 4}
          validate={(value) => true}
          helperText={getAllValuesForConstantKeyAsDict(
            langFile,
            "MOBILE_PRELIMINARY_PATIENNUM_INPUT_ERROR"
          )}
        />
      ),
      // validate: (value) => value.trim().length === 4,
      validate: (value) => true,
      isValidate: true,
    },
    {
      id: "patientBirthQuestion",
      questionKey: "patientBirth",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_PATIENTBIRTH_DESC"
      ),
      inputComponent: (props) => (
        <MyTextInput
          {...props}
          placeholder={getAllValuesForConstantKeyAsDict(
            langFile,
            "MOBILE_PRELIMINARY_BIRTHDAY_INPUT_PLACEHOLDER"
          )}
          validate={(value) => value.trim().length === 8}
          helperText={getAllValuesForConstantKeyAsDict(
            langFile,
            "MOBILE_PRELIMINARY_PATIENTBIRTH_INPUT_ERROR"
          )}
        />
      ),
      validate: (value) => value.trim().length === 8,
    },
  ],
  [
    {
      id: "symptomsSlide",
      questionKey: "userSymptoms",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_SYMPTOMS_DESC"
      ),
      inputComponent: (props) => (
        <MyButtonGroup
          {...props}
          options={symptomsOptions}
          value={typeof props.value === "string" ? props.value : "{}"} // Ensure string for MyButtonGroup
        />
      ),
      validate: (value) => {
        if (typeof value !== "string") return false;
        try {
          const parsed = JSON.parse(value || "{}");
          return Object.entries(parsed).some(([key, val]) => {
            const option = symptomsOptions.find((opt) => opt.id === key);
            if (option?.type === "etc") {
              return typeof val === "string" && val.trim().length > 0;
            }
            return !!val; // For button types
          });
        } catch (e) {
          return false; // Invalid JSON
        }
      },
      isValidate: true,
      isPass: false,
      passText: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_SYMPTOMS_NOT_SURE"
      ),
    },
  ],
  [
    {
      id: "painSlide",
      questionKey: "userPain",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_PAIN_DESC"
      ),
      inputComponent: (props) => <MySliderInput {...props} />,
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: true,
    },
  ],
  [
    {
      id: "diagnosisSlide",
      questionKey: "userDiagnosis",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_DIAGNOSIS_DESC"
      ),
      content: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_DIAGNOSIS_SUBDESC"
      ),
      inputComponent: (props) => (
        <MyTextArea
          {...props}
          placeholder={getAllValuesForConstantKeyAsDict(
            langFile,
            "MOBILE_PRELIMINARY_DIAGNOSIS_INPUT_PLACEHOLDER"
          )}
        />
      ),
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: false,
      passText: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_DIAGNOSIS_NOT_SURE"
      ),
    },
  ],
  [
    {
      id: "treatmentSlide",
      questionKey: "userTreatment",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_TREATMENT_DESC"
      ),
      content: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_TREATMENT_SUBDESC"
      ),
      inputComponent: (props) => (
        <MyTextArea
          {...props}
          placeholder={getAllValuesForConstantKeyAsDict(
            langFile,
            "MOBILE_PRELIMINARY_TREATMENT_INPUT_PLACEHOLDER"
          )}
        />
      ),
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: false,
      passText: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_TREATMENT_NOT_SURE"
      ),
    },
  ],
  [
    {
      id: "specificSlide",
      questionKey: "userSpecific",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_SPECIFIC_DESC"
      ),
      inputComponent: (props) => (
        <MyTextArea
          {...props}
          placeholder={getAllValuesForConstantKeyAsDict(
            langFile,
            "MOBILE_PRELIMINARY_SPECIFIC_INPUT_PLACEHOLDER"
          )}
        />
      ),
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: true,
      passText: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_SPECIFIC_NOT_SURE"
      ),
    },
  ],
  [
    {
      id: "pastHistorySlide",
      questionKey: "userPastHistory",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_PAST_HISTORY_DESC"
      ),
      content: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_PAST_HISTORY_SUBDESC"
      ),
      inputComponent: (props) => (
        <MyButtonGroup
          {...props}
          options={pastHistoryOptions}
          value={typeof props.value === "string" ? props.value : "{}"}
        />
      ),
      validate: (value) => {
        if (typeof value !== "string") return false;
        try {
          const parsed = JSON.parse(value || "{}");
          return Object.entries(parsed).some(([key, val]) => {
            const option = pastHistoryOptions.find((opt) => opt.id === key);
            if (option?.type === "etc") {
              return typeof val === "string" && val.trim().length > 0;
            }
            return !!val;
          });
        } catch (e) {
          return false;
        }
      },
      isValidate: true,
      isPass: false,
      passText: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_PAST_HISTORY_NOT_SURE"
      ),
    },
  ],
  [
    {
      id: "familyHistorySlide",
      questionKey: "userFamilyHistory",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_FAMILY_HISTORY_DESC"
      ),
      content: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_FAMILY_HISTORY_SUBDESC"
      ),
      inputComponent: (props) => (
        <MyButtonGroup
          {...props}
          options={familyHistoryOptions}
          value={typeof props.value === "string" ? props.value : "{}"}
        />
      ),
      validate: (value) => {
        if (typeof value !== "string") return false;
        try {
          const parsed = JSON.parse(value || "{}");
          return Object.entries(parsed).some(([key, val]) => {
            const option = familyHistoryOptions.find((opt) => opt.id === key);
            if (option?.type === "etc") {
              return typeof val === "string" && val.trim().length > 0;
            }
            return !!val;
          });
        } catch (e) {
          return false;
        }
      },
      isValidate: true,
      isPass: false,
      passText: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_FAMILY_HISTORY_NOT_SURE"
      ),
    },
  ],
  [
    {
      id: "smokeSlide",
      questionKey: "userSmoke",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_SMOKE_DESC"
      ),
      inputComponent: (props) => (
        <MySelectButtonGroup
          {...props}
          options={smokeOptions}
          value={typeof props.value === "string" ? props.value : null}
          onChange={(selectedId) => props.onChange(selectedId ?? "")} // 부모가 string을 기대하므로 null일 경우 빈 문자열 전달
          isOneLine={true}
        />
      ),
      validate: (value) => typeof value === "string" && value.length > 0, // 하나는 선택해야 유효
      isValidate: true,
      isPass: true,
    },
  ],
  [
    {
      id: "drinkSlide",
      questionKey: "userDrink",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_DRINK_DESC"
      ),
      inputComponent: (props) => (
        <MySelectButtonGroup
          {...props}
          options={drinkOptions}
          value={typeof props.value === "string" ? props.value : null}
          onChange={(selectedId) => props.onChange(selectedId ?? "")} // 부모가 string을 기대하므로 null일 경우 빈 문자열 전달
          isOneLine={true}
        />
      ),
      validate: (value) => typeof value === "string" && value.length > 0, // 하나는 선택해야 유효
      isValidate: true,
      isPass: true,
    },
  ],
  [
    {
      id: "pastSurgerySlide",
      questionKey: "userPastSurgery",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_PAST_SURGERIES_DESC"
      ),
      inputComponent: (props) => (
        <MyButtonGroup
          {...props}
          options={pastSurgeriesOptions}
          value={typeof props.value === "string" ? props.value : "{}"}
        />
      ),
      validate: (value) => {
        if (typeof value !== "string") return false;
        try {
          const parsed = JSON.parse(value || "{}");
          return Object.entries(parsed).some(([key, val]) => {
            const option = pastSurgeriesOptions.find((opt) => opt.id === key);
            if (option?.type === "etc") {
              return typeof val === "string" && val.trim().length > 0;
            }
            return !!val;
          });
        } catch (e) {
          return false;
        }
      },
      isValidate: true,
      isPass: false,
      passText: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_PAST_SURGERIES_NOT_SURE"
      ),
    },
  ],
  [
    {
      id: "allergySlide",
      questionKey: "userAllergy",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_ALLERGY_DESC"
      ),
      content: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_ALLERGY_SUBDESC"
      ),
      inputComponent: (props) => (
        <MyButtonGroup
          {...props}
          options={allergyOptions}
          value={typeof props.value === "string" ? props.value : "{}"}
          placeholder={getAllValuesForConstantKeyAsDict(
            langFile,
            "MOBILE_PRELIMINARY_ALLERGY_INPUT_PLACEHOLDER"
          )}
        />
      ),
      validate: (value) => {
        if (typeof value !== "string") return false;
        try {
          const parsed = JSON.parse(value || "{}");
          return Object.entries(parsed).some(([key, val]) => {
            const option = familyHistoryOptions.find((opt) => opt.id === key);
            if (option?.type === "etc") {
              return typeof val === "string" && val.trim().length > 0;
            }
            return !!val;
          });
        } catch (e) {
          return false;
        }
      },
      isValidate: true,
      isPass: false,
      passText: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_ALLERGY_NOT_SURE"
      ),
    },
  ],
  [
    {
      id: "todoctorSlide",
      questionKey: "userTodoctor",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_TODOCTOR_DESC"
      ),
      content: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_TODOCTOR_SUBDESC"
      ),
      inputComponent: (props) => (
        <MyTextArea
          {...props}
          placeholder={getAllValuesForConstantKeyAsDict(
            langFile,
            "MOBILE_PRELIMINARY_TODOCTOR_INPUT_PLACEHOLDER"
          )}
        />
      ),
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: false,
      passText: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_TODOCTOR_NOT_SURE"
      ),
    },
  ],
  [
    {
      id: "summarySlide",
      questionKey: "summaryPage",
      title: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_SUMMARY_DESC"
      ),
      content: getAllValuesForConstantKeyAsDict(
        langFile,
        "MOBILE_PRELIMINARY_SUMMARY_SUBDESC"
      ),
      isSummary: true,
    },
  ],
];
