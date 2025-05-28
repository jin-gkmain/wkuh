import React from "react";
import {
  SlideContent,
  InputComponentProps,
} from "../pages/mobile/preliminary/PreliminaryLayout"; // 경로가 정확한지 확인해주세요.
import { TextField } from "@mui/material";

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
    rows={3}
    variant="standard"
    style={commonInputStyles}
    slotProps={{
      input: {
        sx: {
          ...commonInputPropsSx, // 공통 스타일 적용
          // TextArea는 내부 input(textarea)의 패딩이 다를 수 있으므로 필요시 오버라이드
          "& .MuiInput-input": {
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

export const testSlides: SlideContent[][] = [
  // 페이지 1: 환자 정보
  [
    {
      id: "patientNumQuestion",
      questionKey: "patientNum",
      content: "병원에서 안내 받은\n 환자 번호를 입력해주세요.",
      inputComponent: (props) => (
        <MyTextInput
          {...props}
          placeholder="환자 번호 (필수, 10자)"
          validate={(value) => value.trim().length === 10}
          helperText="환자번호는 10자입니다."
        />
      ),
      validate: (value) => value.trim().length === 10,
      isValidate: true,
    },
    {
      id: "nameQuestion",
      questionKey: "patientBirth",
      content: "본인의 생년월일을\n 입력해주세요",
      inputComponent: (props) => (
        <MyTextInput
          {...props}
          placeholder="생년월일 (필수, 6자)"
          validate={(value) => value.trim().length === 6}
          helperText="생년월일은 6자입니다."
        />
      ),
      validate: (value) => value.trim().length === 6,
    },
  ],
  // 페이지 2: 개인 정보
  [
    {
      id: "ageSlide",
      questionKey: "userAge",
      title: "나이",
      content: (
        <p>
          나이를 알려주세요. <i>(숫자, 1세 이상 130세 이하)</i>
        </p>
      ),
      inputComponent: (props) => (
        <MyNumberInput {...props} placeholder="나이 (필수, 1-130)" />
      ),
      validate: (value) => {
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 1 && num <= 130;
      },
      isValidate: true,
    },
    {
      id: "emailSlide",
      questionKey: "userEmail",
      title: "이메일 주소",
      content: "이메일 주소를 입력해주세요. (선택 사항)",
      inputComponent: (props) => (
        <MyTextInput {...props} placeholder="example@example.com (선택)" />
      ),
      validate: (value) => {
        if (!value || String(value).trim() === "") return true; // 선택 사항이므로 비어있어도 유효
        // 간단한 이메일 형식 검사 (정규식 사용 권장)
        return String(value).includes("@") && String(value).includes(".");
      },
    },
  ],
  // 페이지 3: 의견
  [
    {
      id: "feedbackSlide",
      questionKey: "userFeedback",
      title: "자유 의견",
      content:
        "남기고 싶은 말이 있다면 자유롭게 작성해주세요. (최소 10자 이상)",
      inputComponent: (props) => (
        <MyTextArea {...props} placeholder="최소 10자 이상 입력해주세요." />
      ),
      validate: (value) =>
        typeof value === "string" && value.trim().length >= 10,
    },
  ],
  // 페이지 4: 완료
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
