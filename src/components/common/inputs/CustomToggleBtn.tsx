// SegmentedPillButtons.jsx
import React, { useState, useEffect } from "react";

// 개별 버튼의 스타일을 결정하는 함수
const getButtonStyle = (isSelected, isHovered) => {
  const baseStyle = {
    padding: "0px 32px", // 버튼 내부 여백 (상하, 좌우)
    borderRadius: "20px", // 알약 모양을 위한 충분한 값
    cursor: "pointer",
    border: "1px solid black", // 기본 테두리
    backgroundColor: "white", // 기본 배경색
    color: "black", // 기본 글자색
    margin: "0 5px", // 버튼 간 간격 (좌우)
    fontSize: "14px", // 글자 크기
    fontWeight: "500", // 글자 두께
    outline: "none", // 클릭 시 기본 outline 제거
    transition:
      "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out", // 부드러운 전환 효과
    whiteSpace: "nowrap", // 버튼 내 텍스트 줄바꿈 방지
  };

  // 선택된 상태의 스타일
  if (isSelected) {
    return {
      ...baseStyle,
      backgroundColor: "#D6EAF8", // 선택 시 배경색 (이미지와 유사한 연한 파란색)
      color: "black", // 선택 시 글자색 (이미지에서는 검은색 유지)
      borderColor: "#D6EAF8", // 선택 시 테두리 색 (배경과 동일하게 하여 없는 것처럼 보이게)
    };
  }

  // 선택되지 않은 버튼에 마우스 호버 시 스타일 (선택사항)
  if (isHovered) {
    return {
      ...baseStyle,
      borderColor: "#777", // 호버 시 테두리 약간 진하게
      // backgroundColor: '#f8f8f8', // 호버 시 배경색 살짝 변경 (선택사항)
    };
  }

  return baseStyle;
};

/**
 * SegmentedPillButtonsGroup 컴포넌트
 * @param {object} props
 * @param {Array<string|{label: string, value: string}>} props.options - 버튼 옵션 배열. 문자열 또는 {label, value} 객체 형태.
 * @param {function} props.onSelect - 버튼 선택 시 호출될 콜백 함수. 선택된 값(value)을 인자로 받음.
 * @param {string|number} [props.defaultValue=null] - 초기에 선택될 버튼의 값.
 * @param {React.CSSProperties} [props.style] - 버튼 그룹 컨테이너에 적용할 추가 스타일.
 */
function SegmentedPillButtonsGroup({
  options,
  onSelect,
  defaultValue = null,
  style,
}) {
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [hoveredOption, setHoveredOption] = useState(null); // 마우스 호버 상태 추적

  // defaultValue prop이 외부에서 변경될 경우 내부 상태 업데이트
  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const handleSelect = (optionValue) => {
    setSelectedOption(optionValue);
    if (onSelect) {
      onSelect(optionValue);
    }
  };

  if (!options || options.length === 0) {
    return null; // 옵션이 없으면 아무것도 렌더링하지 않음
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", ...style }}>
      {options.map((option) => {
        // 옵션이 객체 형태일 수도, 문자열일 수도 있음
        const optionValue = typeof option === "object" ? option.value : option;
        const optionLabel = typeof option === "object" ? option.label : option;

        const isSelected = selectedOption === optionValue;
        const isButtonHovered = hoveredOption === optionValue;

        return (
          <button
            key={optionValue}
            style={getButtonStyle(isSelected, !isSelected && isButtonHovered)} // 선택되지 않았을 때만 호버 스타일 적용
            onClick={() => handleSelect(optionValue)}
            onMouseEnter={() => setHoveredOption(optionValue)}
            onMouseLeave={() => setHoveredOption(null)}
          >
            {optionLabel}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedPillButtonsGroup;
