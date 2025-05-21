import React from 'react';
import langFile from '@/lang';
import { LangType } from '@/context/LanguageContext';
import { ChangeEvent, ReactNode } from 'react';
import Send from '../common/icons/Send';
import FlagKoreaSq from '../common/icons/FlagKoreaSq';
import SelectInput from '../common/inputs/SelectInput';
import FlagMongolSq from '../common/icons/FlagMongolSq';
import dayjs from 'dayjs';
import DropFileInput from '../common/inputs/DropFileInput';



type PatientViewProps = {
  lang: LangType;
  org: Organization | null;
  chartInfo: DiagnosisModal;
  userInfo: StoredUser | null;
  handleTopBtnClick?: (type: ModalType) => void;
  handleInputChange?: (ev: ChangeEvent) => void;
  handleSelect?: (user: User, key: string) => void;
  handleSetFiles: (files: File[], gubun2: string) => void;
  patientInfo?: Patient;
  view?: boolean;
  children?: ReactNode;
  patient?: boolean;
  filesData: any;
  getFileGubun: (tabType: string) => string;
  onRemove: (id: string, type: string) => void;
  tabType: string;

};


export function PatientView({
  lang,
  org,
  patientInfo,
  chartInfo,
  userInfo,
  handleTopBtnClick,
  handleInputChange,
  handleSelect,
  handleSetFiles,
  children,
  view = false,
  patient = false,
  filesData,
  getFileGubun,
  onRemove,
  tabType,
}: PatientViewProps) {
  return (
    <div
      className={`main-tab-section relative flex flex-col ${
        view ? 'patient-view' : ''
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

          {userInfo && userInfo.country !== 'korea' && (
            <button
              className="primary-btn"
              type="button"
              onClick={() => {
                handleTopBtnClick('confirm');
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
                value={patientInfo?.u_name_eng || ''}
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
                        .subtract(dayjs(patientInfo?.birthday).year(), 'year')
                        .year()
                        .toString()
                    : '-'
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
                value={patientInfo?.sex || ''}
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
                    ? dayjs(patientInfo?.birthday).format('YYYY/MM/DD')
                    : ''
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
                value={patientInfo?.tall || ''}
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
                value={patientInfo?.weight || ''}
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

      {/* 진료 기본정보 */}
      <div className="diagnosis-info-container">
        <div className="content-header">
          <h3>
            {langFile[lang].WORKFLOW_MODAL_CHART_INFO}
            {/* 진료 기본정보 */}
          </h3>
        </div>

        <div className="flex flex-col gap-10">
          <div className="input-row-wrap">
            <div className="input-col-wrap">
              <span className="label flex gap-3 align-center">
                <FlagMongolSq width={10} height={10} />
                {langFile[lang].WORKFLOW_MODAL_CHART_INFO_NURSE1}
                {/* 몽골 간호사 */}
              </span>
              <SelectInput
                usersJobType="nurse"
                disabled={view || patient}
                o_idx={patientInfo?.o_idx}
                valueKey="nurse1"
                onSelect={handleSelect}
                selected={
                  chartInfo.nurse1_idx
                    ? lang === 'ko'
                      ? chartInfo.nurse1_name_kor
                      : chartInfo.nurse1_name_eng
                    : ''
                }
              />
            </div>

            <div className="input-col-wrap">
              <span className="label flex align-center gap-3">
                <FlagMongolSq width={10} height={10} />
                {langFile[lang].WORKFLOW_MODAL_CHART_INFO_DOCTOR1}
                {/* 몽골 의사 */}
              </span>
              <SelectInput
                usersJobType="doctor"
                o_idx={patientInfo?.o_idx}
                valueKey="doctor1"
                onSelect={handleSelect}
                selected={
                  chartInfo.doctor1_idx
                    ? lang === 'ko'
                      ? chartInfo.doctor1_name_kor || ''
                      : chartInfo.doctor1_name_eng || ''
                    : ''
                }
                disabled={view || patient}
              />
            </div>

            <div className="input-col-wrap"></div>
          </div>

          <div className="input-row-wrap">
            <div className="input-col-wrap">
              <span className="label flex align-center gap-3">
                <FlagKoreaSq width={10} height={10} />
                {langFile[lang].WORKFLOW_MODAL_CHART_INFO_NURSE2}
                {/* 한국 간호사 */}
              </span>
              <SelectInput
                usersJobType="nurse"
                o_idx={
                  userInfo
                    ? userInfo.country === 'korea'
                      ? userInfo.o_idx
                      : org?.parent_o_idx || 0
                    : 0
                }
                valueKey="nurse2"
                onSelect={handleSelect}
                selected={
                  chartInfo.nurse2_idx
                    ? lang === 'ko'
                      ? chartInfo.nurse2_name_kor || ''
                      : chartInfo.nurse2_name_eng || ''
                    : ''
                }
                disabled={view || patient}
              />
            </div>
            <div className="input-col-wrap">
              <span className="label flex align-center gap-3">
                <FlagKoreaSq width={10} height={10} />
                {langFile[lang].WORKFLOW_MODAL_CHART_INFO_DOCTOR2}
                {/* 한국 의사 */}
              </span>
              <SelectInput
                usersJobType="doctor"
                o_idx={
                  userInfo
                    ? userInfo.country === 'korea'
                      ? userInfo.o_idx
                      : org?.parent_o_idx || 0
                    : 0
                }
                valueKey="doctor2"
                onSelect={handleSelect}
                selected={
                  chartInfo.doctor2_idx
                    ? lang === 'ko'
                      ? chartInfo.doctor2_name_kor || ''
                      : chartInfo.doctor2_name_eng || ''
                    : ''
                }
                disabled={view || patient}
              />
            </div>
            <div className="input-col-wrap"></div>
          </div>
        </div>
      </div>

      {/* 환자 의료정보 */}
      <div className="medical-info-container">
        <div className="content-header">
          <h3>
            {langFile[lang].WORKFLOW_MODAL_PT_MEDICAL_INFO}
            {/* 환자 의료정보 */}
          </h3>
        </div>

        <div className="input-col-wrap">
          <div className="input-col-wrap">
            <label htmlFor="pa_symptoms" className="label">
              {langFile[lang].WORKFLOW_MODAL_PT_SYMTOM}
              {/* 증상 */}
            </label>
            <textarea
              disabled={view}
              autoComplete="off"
              name="pa_symptoms"
              id="pa_symptoms"
              className="input"
              onChange={handleInputChange}
              value={chartInfo.pa_symptoms || ''}
            />
          </div>

          <div className="input-col-wrap">
            <label htmlFor="pa_diagnosis" className="label">
              {langFile[lang].WORKFLOW_MODAL_PT_DIAGNOSIS_NAME}
              {/* 진단명 */}
            </label>
            <textarea
              disabled={view}
              autoComplete="off"
              value={chartInfo.pa_diagnosis || ''}
              onChange={handleInputChange}
              name="pa_diagnosis"
              id="pa_diagnosis"
              className="input textarea-m"
            />
          </div>

          <div className="input-col-wrap">
            <label htmlFor="pa_care_sofar" className="label">
              {langFile[lang].WORKFLOW_MODAL_PT_TREATMENT_HISTORY}
              {/* 그동안 받은 치료 */}
            </label>
            <textarea
              disabled={view}
              autoComplete="off"
              value={chartInfo.pa_care_sofar || ''}
              onChange={handleInputChange}
              name="pa_care_sofar"
              id="pa_care_sofar"
              className="input"
            />
          </div>

          <div className="input-col-wrap">
            <label htmlFor="pa_care_korea" className="label">
              {langFile[lang].WORKFLOW_MODAL_PT_PREFER_TREATMENT}
              {/* 한국에서 받기 원하는 치료 */}
            </label>
            <textarea
              disabled={view}
              autoComplete="off"
              value={chartInfo.pa_care_korea || ''}
              onChange={handleInputChange}
              name="pa_care_korea"
              id="pa_care_korea"
              className="input"
            />
          </div>

          <div className="input-col-wrap">
            <span className="label">
              {langFile[lang].WORKFLOW_MODAL_PT_CASE_HISTORY}
              {/* 병력 */}
            </span>
            <div className="input flex flex-col gap-5 check-area">
              <section className="flex gap-10 align-center">
                <span className="shrink-0">
                  {langFile[lang].WORKFLOW_MODAL_PT_FAMILY_CASE_HISTORY} :
                  {/* 가족력: */}
                </span>
                <div className="flex gap-10 flex-1">
                  <span className="flex gap-5 align-center shrink-0">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history11"
                      id="pa_medical_history11"
                      value={chartInfo.pa_medical_history11 || 'n'}
                      checked={chartInfo.pa_medical_history11 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history11" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_HTN}
                      {/* 고혈압 */}
                    </label>
                  </span>
                  <span className="flex gap-5 align-center">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history12"
                      id="pa_medical_history12"
                      value={chartInfo.pa_medical_history12 || 'n'}
                      checked={chartInfo.pa_medical_history12 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history12" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_DM}
                      {/* 당뇨 */}
                    </label>
                  </span>
                  <span className="flex gap-5 align-center">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history13"
                      id="pa_medical_history13"
                      value={chartInfo.pa_medical_history13 || 'n'}
                      checked={chartInfo.pa_medical_history13 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history13" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_TB}
                      {/* 결핵 */}
                    </label>
                  </span>
                  <span className="flex gap-5 align-center">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history14"
                      id="pa_medical_history14"
                      value={chartInfo.pa_medical_history14 || 'n'}
                      checked={chartInfo.pa_medical_history14 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history14" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_CANCER}
                      {/* 암 */}
                    </label>
                  </span>
                  <span className="flex gap-5 align-center flex-1">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history15"
                      id="pa_medical_history15"
                      value={chartInfo.pa_medical_history15 || 'n'}
                      checked={chartInfo.pa_medical_history15 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history15" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_ECT}
                      {/* 기타 */}
                    </label>
                    <input
                      readOnly={view}
                      autoComplete="off"
                      type="text"
                      name="pa_medical_history16"
                      className="check-input flex-1"
                      value={chartInfo.pa_medical_history16 || ''}
                      onChange={handleInputChange}
                    />
                  </span>
                </div>
              </section>

              <section className="flex gap-10 align-center">
                <span className="shrink-0">
                  {langFile[lang].WORKFLOW_MODAL_PT_PAST_CASE_HISTORY} :
                  {/* 과거력: */}
                </span>
                <div className="flex gap-10 flex-1">
                  <span className="flex gap-5 align-center shrink-0">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history21"
                      id="pa_medical_history21"
                      value={chartInfo.pa_medical_history21 || 'n'}
                      checked={chartInfo.pa_medical_history21 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history21" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_HTN}
                      {/* 고혈압 */}
                    </label>
                  </span>
                  <span className="flex gap-5 align-center">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history22"
                      id="pa_medical_history22"
                      value={chartInfo.pa_medical_history22 || 'n'}
                      checked={chartInfo.pa_medical_history22 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history22" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_DM}
                      {/* 당뇨 */}
                    </label>
                  </span>
                  <span className="flex gap-5 align-center">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history23"
                      id="pa_medical_history23"
                      value={chartInfo.pa_medical_history23 || 'n'}
                      checked={chartInfo.pa_medical_history23 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history23" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_TB}
                      {/* 결핵 */}
                    </label>
                  </span>
                  <span className="flex gap-5 align-center">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history24"
                      id="pa_medical_history24"
                      value={chartInfo.pa_medical_history24 || 'n'}
                      checked={chartInfo.pa_medical_history24 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history24" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_CANCER}
                      {/* 암 */}
                    </label>
                  </span>
                  <span className="flex gap-5 align-center flex-1">
                    <input
                      readOnly={view}
                      type="checkbox"
                      name="pa_medical_history25"
                      id="pa_medical_history25"
                      value={chartInfo.pa_medical_history25 || 'n'}
                      checked={chartInfo.pa_medical_history25 === 'y'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="pa_medical_history25" className="shrink-0">
                      {langFile[lang].WORKFLOW_MODAL_PT_ECT}
                      {/* 기타 */}
                    </label>
                    <input
                      readOnly={view}
                      autoComplete="off"
                      type="text"
                      name="pa_medical_history26"
                      className="check-input flex-1"
                      value={chartInfo.pa_medical_history26 || ''}
                      onChange={handleInputChange}
                    />
                  </span>
                </div>
              </section>
            </div>
          </div>

          <div className="input-col-wrap">
            <label htmlFor="pa_surgical_history" className="label">
              {langFile[lang].WORKFLOW_MODAL_PT_SURGERY_HISTORY}
              {/* 수술력 */}
            </label>
            <textarea
              disabled={view}
              autoComplete="off"
              name="pa_surgical_history"
              id="pa_surgical_history"
              className="input"
              value={chartInfo.pa_surgical_history || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-col-wrap">
            <label htmlFor="pa_medicine_history" className="label">
              {langFile[lang].WORKFLOW_MODAL_PT_DRUG_HISTORY}
              {/* 약물력 */}
            </label>
            <textarea
              disabled={view}
              autoComplete="off"
              name="pa_medicine_history"
              id="pa_medicine_history"
              className="input"
              value={chartInfo.pa_medicine_history || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-col-wrap">
            <label htmlFor="pa_allergy" className="label">
              {langFile[lang].WORKFLOW_MODAL_PT_ALLERGY_INFO}
              {/* 알러지 정보 */}
            </label>
            <textarea
              disabled={view}
              autoComplete="off"
              name="pa_allergy"
              id="pa_allergy"
              className="input"
              value={chartInfo.pa_allergy || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-col-wrap">
            <span className="label">
              {langFile[lang].ATTACHED_FILE}
              {/* 첨부파일 */}
            </span>
            <DropFileInput
              labelText
                disabled={false}
                type="첨부"
                files={filesData[getFileGubun(tabType)]['첨부']}
                onRemove={onRemove}
                setFiles={handleSetFiles}
                dropFile={() => {}}
              />
          </div>
        </div>
      </div>
    </div>
  );
}


type OpinionViewProps = {
  userInfo: StoredUser | null;
  lang: LangType;
  handleTopBtnClick: (type: ModalType) => void;
  chartInfo: DiagnosisModal;
  handleInputChange: (ev: ChangeEvent) => void;
  filesData: any;
  getFileGubun: (tabType: string) => string;
  onRemove: (id: string, type: string) => void;
  handleSetFiles: (files: File[], gubun2: string) => void;
  tabType: string;
};

export function OpinionView({
  userInfo,
  lang,
  handleTopBtnClick,
  chartInfo,
  handleInputChange,
  filesData,
  getFileGubun,
  onRemove,
  handleSetFiles,
  tabType,
}: OpinionViewProps) {
  return (
    <div className="main-tab-section relative flex flex-col">
      <div className="flex gap-5 header-buttons">
        {userInfo && userInfo.country === 'korea' && !userInfo.p_idx && (
          <button
            className="primary-btn"
            type="button"
            onClick={() => handleTopBtnClick('confirm')}
          >
            {langFile[lang].WORKFLOW_MODAL_CONFIRM_OPINION_BUTTON_TEXT}
            <Send />
            {/* 소견서 확인 요청 */}
          </button>
        )}
      </div>

      <div className="patient-info-container">
        <div className="content-header">
          <h3>
            {langFile[lang].WORKFLOW_MODAL_OPINION_DOMESTIC_HOSPITAL_OPINION}
            {/* 국내병원 소견서 */}
          </h3>
        </div>
      </div>

      <div className="input-col-wrap">
        <div className="input-col-wrap">
          <label htmlFor="op_contents" className="label">
            {langFile[lang].WORKFLOW_MODAL_OPINION_CONTENTS}
            {/* 소견내용 */}
          </label>
          <textarea
            disabled={!!(userInfo && userInfo.p_idx)}
            autoComplete="off"
            name="op_contents"
            id="op_contents"
            value={chartInfo.op_contents || ''}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="input-col-wrap">
          <span className="label">
            {langFile[lang].ATTACHED_FILE}
            {/* 첨부파일 */}
          </span>
          <DropFileInput
            disabled={!!(userInfo && userInfo.p_idx)}
            labelText
            files={filesData[getFileGubun(tabType)]['첨부']}
            onRemove={onRemove}
            setFiles={handleSetFiles}
            type="첨부"
          />
        </div>
      </div>
    </div>
  );
}

  