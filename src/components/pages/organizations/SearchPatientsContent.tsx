import React, { ChangeEvent, FormEvent, useState } from "react";
import langFile from "@/lang";
import { LangType } from "@/context/LanguageContext";
import FlagMongolSq from "@/components/common/icons/FlagMongolSq";
import { searchOptions } from "@/pages/workflow";
import FlagKoreaSq from "@/components/common/icons/FlagKoreaSq";
import { useAppSelector } from "@/store";

function SearchPatientsContent({
  lang,
  onComplete,
  o_idx,
}: {
  lang: "ko" | "en";
  onComplete: (searchOpsiont: searchOptions) => void;
  o_idx: string;
}) {
  const { userInfo } = useAppSelector(({ user }) => user);
  const [searchInputs, setSearchInputs] = useState({
    search_p_chart_no: "",
    search_name: "",
    search_nurse: "",
  });

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;
    const { name, value } = target;
    setSearchInputs((prev) => ({ ...prev, [name]: value }));
  };

  // 검색버튼 클릭시 동작
  const handleSearch = (ev?: FormEvent<HTMLFormElement>) => {
    ev?.preventDefault();
    onComplete(searchInputs);
  };

  // // 새로고침 버튼 클릭시 동작
  // const handleRefresh = () => {
  //   const initialData = {
  //     search_p_chart_no: '',
  //     search_name: '',
  //     search_nurse: '',
  //   };
  //   setSearchInputs(initialData);
  //   onComplete(initialData);
  // };

  return (
    <>
      <form className="search-area" onSubmit={handleSearch}>
        <div className="search-box flex">
          <div className="flex item-row align-center">
            <label htmlFor="search_p_chart_no">
              {langFile[lang].PATIENT_CODE_TEXT}
              {/** 환자번호 */}
            </label>

            <input
              autoComplete="off"
              value={searchInputs.search_p_chart_no}
              onChange={handleInputChange}
              className="search-box-input"
              type="text"
              name="search_p_chart_no"
              id="search_p_chart_no"
            />
          </div>

          <div className="flex item-row align-center">
            <label htmlFor="search_name">
              {langFile[lang].PATIENT_SEARCH_PT_NAME_TEXT}
              {/** 환자명 */}
            </label>

            <input
              autoComplete="off"
              value={searchInputs.search_name}
              onChange={handleInputChange}
              className="search-box-input"
              type="text"
              name="search_name"
              id="search_name"
            />
          </div>

          <div className="flex item-row align-center">
            <label htmlFor="search_nurse" className="flex gap-3 justify-end">
              {userInfo?.country === "korea" && (
                <FlagKoreaSq width={13} height={13} />
              )}
              {userInfo?.country === "mongolia" && (
                <FlagMongolSq width={13} height={13} />
              )}
              {langFile[lang].PATIENT_SEARCH_NURSE}
              {/** 간호사 */}
            </label>

            <input
              autoComplete="off"
              value={searchInputs.search_nurse}
              onChange={handleInputChange}
              className="search-box-input"
              type="text"
              name="search_nurse"
              id="search_nurse"
            />
          </div>

          <button className="primary-btn search-btn" type="submit">
            {langFile[lang].SEARCH_BUTTON_TEXT}
            {/* 조회 */}
          </button>
        </div>
      </form>
    </>
  );
}

export default React.memo(SearchPatientsContent);
