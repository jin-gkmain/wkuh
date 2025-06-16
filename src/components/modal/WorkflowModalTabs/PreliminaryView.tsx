import React from "react";
import langFile from "@/lang";
import { LangType } from "@/context/LanguageContext";
import { ChangeEvent, ReactNode } from "react";
import Send from "../../common/icons/Send";
import dayjs from "dayjs";
import { Input, Stack, Typography, Chip, Box } from "@mui/material";

// 유틸리티 함수들
const parseJsonString = (jsonString: string | any) => {
  console.log(
    "🔍 parseJsonString 입력:",
    jsonString,
    "타입:",
    typeof jsonString
  );
  if (typeof jsonString === "string") {
    try {
      const parsed = JSON.parse(jsonString);
      console.log("🔍 JSON 파싱 성공:", parsed);
      return parsed;
    } catch (e) {
      console.warn("JSON 파싱 실패:", jsonString, e);
      return {};
    }
  }
  console.log("🔍 문자열이 아님, 그대로 반환:", jsonString);
  return jsonString || {};
};

const getSelectedOptions = (data: any) => {
  if (!data) return [];
  const parsed = parseJsonString(data);
  return Object.entries(parsed)
    .filter(
      ([key, value]) =>
        value === true || (typeof value === "string" && value.trim() !== "")
    )
    .map(([key, value]) => ({ key, value }));
};

const getDiagnosisText = (diagnosis: any, lang: LangType) => {
  if (typeof diagnosis === "object" && diagnosis !== null) {
    return diagnosis[lang] || diagnosis.ko || diagnosis.en || "알 수 없음";
  }
  return diagnosis || "알 수 없음";
};

// 키-값 매핑
const getKeyDisplayText = (key: string, lang: LangType) => {
  const keyMappings: { [key: string]: { [key: string]: string } } = {
    // 증상
    sym1: { ko: "두통", en: "Headache" },
    sym2: { ko: "가슴 통증", en: "Chest pain" },
    sym3: { ko: "복통", en: "Abdominal pain" },
    sym4: { ko: "기침", en: "Cough" },
    sym5: { ko: "열", en: "Fever" },
    sym6: { ko: "매스꺼움/구토", en: "Nausea" },
    sym7: { ko: "설사/변비", en: "Diarrhea" },
    sym8: { ko: "피부 발진", en: "Skin rash" },
    sym9: { ko: "생리 이상", en: "Menstrual irregularities" },
    sym10: { ko: "우울 불안", en: "Depression/Anxiety" },

    // 기왕력
    past1: { ko: "고혈압", en: "Hypertension" },
    past2: { ko: "당뇨병", en: "Diabetes" },
    past3: { ko: "결핵", en: "Tuberculosis" },
    past4: { ko: "암", en: "Cancer" },
    past5: { ko: "기타", en: "Others" },

    // 가족력
    family1: { ko: "고혈압", en: "Hypertension" },
    family2: { ko: "당뇨병", en: "Diabetes" },
    family3: { ko: "결핵", en: "Tuberculosis" },
    family4: { ko: "암", en: "Cancer" },
    family5: { ko: "기타", en: "Others" },

    // 알레르기
    allergy1: { ko: "약물", en: "Medication" },
    allergy2: { ko: "음식", en: "Food" },
    allergy3: { ko: "꽃가루", en: "Pollens" },
    allergy4: { ko: "동물 털", en: "Animal hair" },
    allergy5: { ko: "먼지", en: "Dust" },
    allergy6: { ko: "금속", en: "Metals" },
    allergy7: { ko: "기타", en: "Others" },

    // 흡연
    smoke1: { ko: "흡연", en: "Smoker" },
    smoke2: { ko: "과거에 피웠지만 끊었음", en: "Quit smoking" },
    smoke3: { ko: "아니요", en: "Non-smoker" },

    // 음주
    drink1: { ko: "음주", en: "Drinker" },
    drink2: { ko: "과거에 마셨지만 끊었음", en: "Quit drinking" },
    drink3: { ko: "아니요", en: "Non-drinker" },
  };

  return keyMappings[key]?.[lang] || keyMappings[key]?.ko || key;
};

type PreliminaryViewProps = {
  lang: LangType;
  chartInfo: DiagnosisModal;
  userInfo: StoredUser | null;
  patientInfo: Patient;
  preliminaryInfo: Preliminary;
  handleTopBtnClick?: (type: ModalType) => void;
  handleInputChange?: (ev: ChangeEvent) => void;
  handleSelect?: (user: User, key: string) => void;
  view?: boolean;
};

export function PreliminaryView({
  lang,
  chartInfo,
  userInfo,
  preliminaryInfo,
  patientInfo,
  handleTopBtnClick,
  handleInputChange,
  handleSelect,
  view,
}: PreliminaryViewProps) {
  const preliminaryRaw = preliminaryInfo?.pl_data;
  console.log("🔍 디버깅 - preliminaryInfo:", preliminaryInfo);
  console.log("🔍 디버깅 - preliminaryRaw:", preliminaryRaw);
  console.log("🔍 디버깅 - preliminaryRaw type:", typeof preliminaryRaw);

  // pl_data 자체가 JSON 문자열이므로 파싱해야 함
  const preliminary = parseJsonString(preliminaryRaw);
  console.log("🔍 디버깅 - parsed preliminary:", preliminary);

  // 개별 속성 확인
  console.log("🔍 개별 속성:");
  console.log("preliminary?.symptoms:", preliminary?.symptoms);
  console.log("preliminary?.symptoms type:", typeof preliminary?.symptoms);
  console.log("preliminary?.pain_degree:", preliminary?.pain_degree);
  console.log("preliminary?.specific:", preliminary?.specific);

  // 데이터 파싱
  const symptoms = getSelectedOptions(preliminary?.symptoms);
  const pastHistory = getSelectedOptions(preliminary?.past_history);
  const familyHistory = getSelectedOptions(preliminary?.family_history);
  const allergies = getSelectedOptions(preliminary?.allergy);
  const diagnosis = getDiagnosisText(preliminary?.diagnosis, lang);
  const pastSurgeries = Array.isArray(preliminary?.past_surgeries)
    ? preliminary.past_surgeries
    : [];

  // 디버깅 로그
  console.log("🔍 파싱된 데이터:");
  console.log("symptoms:", symptoms);
  console.log("pastHistory:", pastHistory);
  console.log("familyHistory:", familyHistory);
  console.log("allergies:", allergies);
  console.log("diagnosis:", diagnosis);

  return (
    <div
      className={`main-tab-section relative flex flex-col ${
        view ? "paperweight-view" : ""
      }`}
    >
      {!view && (
        <div className="flex gap-5 header-buttons">
          {/* <button
            className="primary-btn"
            type="button"
            onClick={() => {
              handleTopBtnClick('download');
            }}
          >
            {langFile[lang].WORKFLOW_MODAL_DOWNLOAD_PT_INFO} <Download />
            // 환자정보 다운로드
          </button> */}

          {userInfo && userInfo.country !== "korea" && (
            <button
              className="primary-btn"
              type="button"
              onClick={() => {
                handleTopBtnClick("confirm");
              }}
            >
              {langFile[lang].WORKFLOW_MODAL_CONFIRM_PT_INFO} <Send />
              {/* 환자정보 확인요청 */}
            </button>
          )}
        </div>
      )}

      {/* 환자 기본정보 */}
      <div className="patient-info-container">
        <div className="content-header">
          <h3>
            {langFile[lang].WORKFLOW_MODAL_PT_INFO}
            {/*환자 기본정보*/}
          </h3>
        </div>

        <div className="flex flex-col gap-10">
          <div className="input-row-wrap">
            <div className="input-col-wrap">
              <label className="label" htmlFor="u_name_eng">
                {langFile[lang].WORKFLOW_MODAL_PT_NAME}
                {/* 이름 */}
              </label>
              <input
                readOnly
                autoComplete="off"
                value={patientInfo?.u_name_eng || ""}
                disabled={true}
                type="text"
                className="input input-disabled"
                name="u_name_eng"
                id="u_name_eng"
              />
            </div>

            <div className="input-col-wrap">
              <label className="label" htmlFor="p_age">
                {langFile[lang].WORKFLOW_MODAL_PT_AGE}
                {/* 나이 */}
              </label>
              <input
                readOnly
                value={
                  patientInfo?.birthday
                    ? dayjs()
                        .subtract(dayjs(patientInfo?.birthday).year(), "year")
                        .year()
                        .toString()
                    : "-"
                }
                disabled
                type="text"
                className="input input-disabled"
                name="p_age"
                id="p_age"
              />
            </div>

            <div className="input-col-wrap">
              <label className="label" htmlFor="p_sex">
                {langFile[lang].WORKFLOW_MODAL_PT_GENDER}
                {/* 성별 */}
              </label>
              <input
                readOnly
                value={patientInfo?.sex || ""}
                disabled
                type="text"
                className="input input-disabled"
                name="p_sex"
                id="p_sex"
              />
            </div>
          </div>

          <div className="input-row-wrap">
            <div className="input-col-wrap">
              <label className="label" htmlFor="p_birthday">
                {langFile[lang].WORKFLOW_MODAL_PT_BIRTH}
                {/* 생년월일 */}
              </label>
              <input
                readOnly
                value={
                  patientInfo?.birthday
                    ? dayjs(patientInfo?.birthday).format("YYYY/MM/DD")
                    : ""
                }
                disabled
                type="text"
                className="input input-disabled"
                name="p_birthday"
                id="p_birthday"
              />
            </div>

            <div className="input-col-wrap">
              <label className="label" htmlFor="p_tall">
                {langFile[lang].WORKFLOW_MODAL_PT_HEIGHT}
                {/* 키 */}
              </label>
              <input
                readOnly
                value={patientInfo?.tall || ""}
                disabled
                type="text"
                className="input input-disabled"
                name="p_tall"
                id="p_tall"
              />
            </div>

            <div className="input-col-wrap">
              <label className="label" htmlFor="p_weight">
                {langFile[lang].PATIENT_MODAL_WEIGHT_TEXT}
                {/* 몸무게(kg) */}
              </label>
              <input
                readOnly
                value={patientInfo?.weight || ""}
                disabled
                type="text"
                className="input input-disabled"
                name="p_weight"
                id="p_weight"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 사전 문진표 */}
      <div>
        <Typography sx={{ fontSize: "1.4em", fontWeight: "bold", mt: 2 }}>
          {langFile[lang].WORKFLOW_MODAL_PR_TITLE}
          {/*사전 문진표*/}
        </Typography>

        <Stack sx={{ mt: 2 }} direction="column" spacing={2}>
          {/* 증상 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_SYMPTOMS_DESC}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {symptoms.length > 0 ? (
                symptoms.map(({ key, value }) => (
                  <Chip
                    key={key}
                    label={getKeyDisplayText(key, lang)}
                    variant="outlined"
                    size="small"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {langFile[lang].MOBILE_PRELIMINARY_SYMPTOMS_NOT_SURE}
                </Typography>
              )}
            </Box>
          </Box>

          {/* 통증 정도 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_PAIN_DESC}
            </Typography>
            <input
              readOnly
              autoComplete="off"
              value={preliminary?.pain_degree || "-"}
              disabled={true}
              type="text"
              className="input input-disabled"
              name="u_name_eng"
              id="u_name_eng"
            />
          </Box>

          {/* 진단명 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_DIAGNOSIS_DESC}
            </Typography>
            <input
              readOnly
              autoComplete="off"
              value={diagnosis}
              disabled={true}
              type="text"
              className="input input-disabled"
            />
          </Box>

          {/* 치료내역 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_TREATMENT_DESC}
            </Typography>
            <input
              readOnly
              autoComplete="off"
              value={preliminary?.treatment || "-"}
              disabled={true}
              type="text"
              className="input input-disabled"
            />
          </Box>

          {/* 원하는 치료 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_SPECIFIC_DESC}
            </Typography>
            <input
              readOnly
              autoComplete="off"
              value={preliminary?.specific || "-"}
              disabled={true}
              type="text"
              className="input input-disabled"
            />
          </Box>

          {/* 기왕력 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_PAST_HISTORY_DESC}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {pastHistory.length > 0 ? (
                pastHistory.map(({ key, value }) => (
                  <Chip
                    key={key}
                    label={getKeyDisplayText(key, lang)}
                    variant="outlined"
                    size="small"
                    color="secondary"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              )}
            </Box>
          </Box>

          {/* 가족력 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_FAMILY_HISTORY_DESC}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {familyHistory.length > 0 ? (
                familyHistory.map(({ key, value }) => (
                  <Chip
                    key={key}
                    label={getKeyDisplayText(key, lang)}
                    variant="outlined"
                    size="small"
                    color="info"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              )}
            </Box>
          </Box>

          {/* 흡연/음주 */}
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                {langFile[lang].MOBILE_PRELIMINARY_SMOKE_DESC}
              </Typography>
              <input
                readOnly
                autoComplete="off"
                value={
                  preliminary?.smoke
                    ? getKeyDisplayText(preliminary.smoke, lang)
                    : "-"
                }
                disabled={true}
                type="text"
                className="input input-disabled"
              />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                {langFile[lang].MOBILE_PRELIMINARY_DRINK_DESC}
              </Typography>
              <input
                readOnly
                autoComplete="off"
                value={
                  preliminary?.drink
                    ? getKeyDisplayText(preliminary.drink, lang)
                    : "-"
                }
                disabled={true}
                type="text"
                className="input input-disabled"
              />
            </Box>
          </Box>

          {/* 수술력 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_PAST_SURGERIES_DESC}
            </Typography>
            {pastSurgeries.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {pastSurgeries.map((surgery, index) => (
                  <Chip
                    key={index}
                    label={surgery}
                    variant="outlined"
                    size="small"
                    color="warning"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
            )}
          </Box>

          {/* 약물 복용력 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_PAST_MEDICINE_DESC}
            </Typography>
            <input
              readOnly
              autoComplete="off"
              value={preliminary?.medical_history || "-"}
              disabled={true}
              type="text"
              className="input input-disabled"
            />
          </Box>

          {/* 알레르기 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_ALLERGY_DESC}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {allergies.length > 0 ? (
                allergies.map(({ key, value }) => (
                  <Chip
                    key={key}
                    label={getKeyDisplayText(key, lang)}
                    variant="outlined"
                    size="small"
                    color="error"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              )}
            </Box>
          </Box>

          {/* 의사에게 전달할 말 */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              {langFile[lang].MOBILE_PRELIMINARY_TODOCTOR_DESC}
            </Typography>
            <input
              readOnly
              autoComplete="off"
              value={
                preliminary?.todoc ||
                langFile[lang].MOBILE_PRELIMINARY_TODOCTOR_NOT_SURE
              }
              disabled={true}
              type="text"
              className="input input-disabled"
            />
          </Box>
        </Stack>
      </div>
    </div>
  );
}
