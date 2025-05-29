import React, { useState, useEffect } from "react";
import {
  SlideContent,
  InputComponentProps,
} from "../pages/mobile/preliminary/PreliminaryLayout"; // 경로가 정확한지 확인해주세요.
import { Button, Slider, Stack, TextField } from "@mui/material";
import langFile from "@/lang";

const commonInputStyles: React.CSSProperties = {
  marginTop: "40px",
  boxSizing: "border-box",
  width: "80%",
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
  placeholder,
  validate,
  helperText,
}: InputComponentProps & { placeholder?: string }) => (
  <TextField
    error={validate && !validate(value) && value.length > 0}
    helperText={
      validate && !validate(value) && value.length > 0 ? helperText : ""
    }
    type="text"
    value={value}
    variant="standard"
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    placeholder={placeholder || "텍스트를 입력하세요"}
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
}: InputComponentProps & { placeholder?: string }) => (
  <TextField
    error={validate && !validate(value) && value.length > 0}
    helperText={
      validate && !validate(value) && value.length > 0 ? helperText : ""
    }
    type="number"
    value={value}
    variant="standard"
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    placeholder={placeholder || "숫자를 입력하세요"}
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
}: Omit<InputComponentProps, "onKeyDown"> & { placeholder?: string }) => (
  <TextField
    error={validate && !validate(value) && value.length > 0}
    helperText={
      validate && !validate(value) && value.length > 0 ? helperText : ""
    }
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder || "자유롭게 작성해주세요..."}
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
}: InputComponentProps & { placeholder?: string }) => {
  const marks = [
    {
      value: 0,
      label: "0 통증 없음",
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
      label: "5 심한 통증",
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
      label: "10 통증 매우 심함",
    },
  ];
  function valuetext(value: number) {
    return `${value}`;
  }
  return (
    <Stack
      direction="row"
      sx={{ height: "300px", marginTop: "40px", width: "40%" }}
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
  options: { id: string; label: string; type: "button" | "etc" }[];
  value: string; // 선택된 옵션 상태를 나타내는 JSON 문자열 e.g., {"sym1": true, "sym11": "기타 증상"}
  onChange: (value: string) => void; // 변경된 상태 객체를 JSON 문자열로 전달
  onKeyDown?: (event: React.KeyboardEvent) => void; // onKeyDown은 옵셔널하게 유지
  isOneLine?: boolean; // 버튼을 한줄로 보여줄지
};

const MyButtonGroup = ({
  options,
  value, // JSON string from props
  onChange,
  onKeyDown,
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
    <div style={{ marginTop: "60px", width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isOneLine ? "1fr" : "1fr 1fr",
          gap: "10px",
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%", // 버튼 너비 강제
                }}
              >
                {option.label}
              </Button>
              {isEtcSelectedAndVisible && (
                <TextField
                  variant="outlined" // 사용자가 변경한 variant 유지
                  fullWidth
                  placeholder="기타 증상을 입력하세요"
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
  options: { id: string; label: string }[]; // etc 타입은 우선 제외, 필요시 추가
  value: string | null; // 선택된 단일 옵션의 ID 또는 null
  onChange: (selectedId: string | null) => void; // 변경된 단일 ID 또는 null을 전달
  onKeyDown?: (event: React.KeyboardEvent) => void;
  isOneLine?: boolean;
};

const MySelectButtonGroup = ({
  options,
  value: selectedOption,
  onChange,
  onKeyDown,
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
    <div style={{ marginTop: "60px", width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isOneLine ? "1fr" : "1fr 1fr",
          gap: "10px",
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Options for MyButtonGroup instances
const symptomsOptions = [
  { id: "sym1", label: "두통", type: "button" as const },
  { id: "sym2", label: "가슴 통증", type: "button" as const },
  { id: "sym3", label: "복통", type: "button" as const },
  { id: "sym4", label: "기침", type: "button" as const },
  { id: "sym5", label: "열", type: "button" as const },
  { id: "sym6", label: "메스꺼움/구토", type: "button" as const },
  { id: "sym7", label: "설사/변비", type: "button" as const },
  { id: "sym8", label: "피부 발진", type: "button" as const },
  { id: "sym9", label: "생리 이상", type: "button" as const },
  { id: "sym10", label: "우울/불안", type: "button" as const },
  { id: "sym11", label: "기타", type: "etc" as const },
];

const pastHistoryOptions = [
  { id: "past1", label: "고혈압", type: "button" as const },
  { id: "past2", label: "당뇨", type: "button" as const },
  { id: "past3", label: "결핵", type: "button" as const },
  { id: "past4", label: "암", type: "button" as const },
  { id: "past5", label: "기타", type: "etc" as const },
];

const familyHistoryOptions = [
  { id: "family1", label: "고혈압", type: "button" as const },
  { id: "family2", label: "당뇨", type: "button" as const },
  { id: "family3", label: "결핵", type: "button" as const },
  { id: "family4", label: "암", type: "button" as const },
  { id: "family5", label: "기타", type: "etc" as const },
];

const smokeOptions = [
  { id: "smoke1", label: "예" },
  { id: "smoke2", label: "아니요" },
  { id: "smoke3", label: "과거에 피웠지만 끊었음" },
];

const drinkOptions = [
  { id: "drink1", label: "예" },
  { id: "drink2", label: "아니요" },
  { id: "drink3", label: "과거에 마셨지만 끊었음" },
];

const pastSurgeriesOptions = [
  { id: "pastSurgery1", label: "맹장수술", type: "button" as const },
  { id: "pastSurgery2", label: "제왕절개", type: "button" as const },
  { id: "pastSurgery3", label: "담낭 제거 수술", type: "button" as const },
  { id: "pastSurgery4", label: "정형외과 수술", type: "button" as const },
  { id: "pastSurgery5", label: "심장 수술", type: "button" as const },
  { id: "pastSurgery6", label: "종양 제거 수술", type: "button" as const },
  { id: "pastSurgery7", label: "기타", type: "etc" as const },
];

const allergyOptions = [
  { id: "allergy1", label: "약물", type: "button" as const },
  { id: "allergy2", label: "음식", type: "button" as const },
  { id: "allergy3", label: "꽃가루", type: "button" as const },
  { id: "allergy4", label: "동물 털", type: "button" as const },
  { id: "allergy5", label: "먼지", type: "button" as const },
  { id: "allergy6", label: "금속", type: "button" as const },
  { id: "allergy7", label: "기타", type: "etc" as const },
];

export const testSlides: SlideContent[][] = [
  [
    {
      id: "patientNumQuestion",
      questionKey: "patientNum",
      title: "병원에서 안내 받은\n환자 번호를 입력해주세요.",
      inputComponent: (props) => (
        <MyTextInput
          {...props}
          placeholder="환자 번호"
          // validate={(value) => value.trim().length === 4}
          validate={(value) => true}
          helperText="잘못된 환자번호입니다."
        />
      ),
      // validate: (value) => value.trim().length === 4,
      validate: (value) => true,
      isValidate: true,
    },
    {
      id: "nameQuestion",
      questionKey: "patientBirth",
      title: "본인의 생년월일을\n입력해주세요",
      inputComponent: (props) => (
        <MyTextInput
          {...props}
          placeholder="생년월일 (필수, 6자)"
          validate={(value) => value.trim().length === 6}
          helperText="생년월일을 6자로 입력해주세요"
        />
      ),
      validate: (value) => value.trim().length === 6,
    },
  ],
  [
    {
      id: "symptomsSlide",
      questionKey: "userSymptoms",
      title: "어떤 증상이 있으신가요?",
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
    },
  ],
  [
    {
      id: "painSlide",
      questionKey: "userPain",
      title: "이번에 발생한 통증은\n어느 정도로 아프신가요?",
      inputComponent: (props) => <MySliderInput {...props} />,
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: true,
    },
  ],
  [
    {
      id: "diagnosisSlide",
      questionKey: "userDiagnosis",
      title: "진단명이 무엇인가요?",
      content: "진단명을 모를 경우 `잘모르겠음` 선택",
      inputComponent: (props) => (
        <MyTextArea {...props} placeholder="진단명을 입력해주세요." />
      ),
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: false,
      passText: "잘모르겠음",
    },
  ],
  [
    {
      id: "treatmentSlide",
      questionKey: "userTreatment",
      title: "그 동안 받은 치료가 있나요?",
      content: "받은 치료가 없다면 `없음` 선택",
      inputComponent: (props) => (
        <MyTextArea {...props} placeholder="치료 내용을 입력해주세요" />
      ),
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: false,
      passText: "없음",
    },
  ],
  [
    {
      id: "specificSlide",
      questionKey: "userSpecific",
      title: "한국에서 받기 원하는\n치료 항목이 있나요?",
      inputComponent: (props) => (
        <MyTextArea
          {...props}
          placeholder="받기 원하는 치료 항목을 입력해주세요."
        />
      ),
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: true,
      passText: "없음",
    },
  ],
  [
    {
      id: "pastHistorySlide",
      questionKey: "userPastHistory",
      title: "과거에 아래의 병력이 있었다면\n 모두 선택 해주세요.",
      content: "병력이 없다면 없음을 눌러주세요",
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
      passText: "없음",
    },
  ],
  [
    {
      id: "familyHistorySlide",
      questionKey: "userFamilyHistory",
      title: "가족중 아래의 질환이 있었다면\n 모두 선택 해주세요.",
      content: "질환이 없다면 없음을 눌러주세요",
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
      passText: "없음",
    },
  ],
  [
    {
      id: "smokeSlide",
      questionKey: "userSmoke",
      title: "흡연을 하시나요?",
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
      title: "음주를 하시나요?",
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
      title: "과거에 수술을 받았나요?",
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
    },
  ],
  [
    {
      id: "allergySlide",
      questionKey: "userAllergy",
      title: "알러지가 있으신가요?",
      content: "알러지가 없다면 `없음`을 눌러주세요",
      inputComponent: (props) => (
        <MyButtonGroup
          {...props}
          options={allergyOptions}
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
      passText: "없음",
    },
  ],
  [
    {
      id: "todoctorSlide",
      questionKey: "userTodoctor",
      title: "의료진에게 전달 할\n내용이 있나요?",
      content: "전달 할 내용이 없다면 `없음`을 눌러주세요",
      inputComponent: (props) => (
        <MyTextArea {...props} placeholder="전달 할 내용을 입력해주세요." />
      ),
      validate: (value) => typeof value === "string" && value.trim().length > 0,
      isPass: false,
      passText: "없음",
    },
  ],
  [
    {
      id: "summarySlide",
      questionKey: "summaryPage",
      title: "제출 완료",
      content: (
        <div style={{ textAlign: "center" }}>
          <h4>설문 완료!</h4>
          <p>참여해주셔서 감사합니다.</p>
          <p style={{ fontSize: "0.9em", color: "gray" }}>
            곧 홈으로 이동합니다.
          </p>
        </div>
      ),
      isSummary: true,
    },
  ],
];
