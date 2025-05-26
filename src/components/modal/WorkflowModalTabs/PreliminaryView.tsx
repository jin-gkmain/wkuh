import React from "react";
import langFile from "@/lang";
import { LangType } from "@/context/LanguageContext";
import { ChangeEvent, ReactNode } from "react";
import Send from "../../common/icons/Send";
import dayjs from "dayjs";
import { Input, Stack, Typography } from "@mui/material";

type PreliminaryViewProps = {
  lang: LangType;
  org: Organization | null;
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
  org,
  chartInfo,
  userInfo,
  preliminaryInfo,
  patientInfo,
  handleTopBtnClick,
  handleInputChange,
  handleSelect,
  view,
}: PreliminaryViewProps) {
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
      <div>
        <Typography sx={{ fontSize: "1.4em", fontWeight: "bold", mt: 2 }}>
          {langFile[lang].WORKFLOW_MODAL_PR_TITLE}
          {/*사전 문진표*/}
        </Typography>
        <Stack
          sx={{
            border: "1px solid rgba(128, 126, 134, 0.56)",
            borderRadius: "2px",
            mt: 2,
            p: 1,
          }}
          direction="column"
          spacing={1}
        >
          <Typography>
            {langFile[lang].WORKFLOW_MODAL_FIRST_QUESTION}
          </Typography>
          <input
            readOnly
            value={patientInfo?.weight || ""}
            disabled
            type="text"
            className="input input-disabled"
            name="p_weight"
            id="p_weight"
            style={{ width: "40%", height: "30px", marginLeft: "15px" }}
          />
          <Typography>
            {langFile[lang].WORKFLOW_MODAL_SECOND_QUESTION}
          </Typography>
        </Stack>
      </div>
    </div>
  );
}
