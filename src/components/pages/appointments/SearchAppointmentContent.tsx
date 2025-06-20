import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import langFile from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";
import DateInput, { Value } from "@/components/common/inputs/DateInput";
import { AppointmentSearchInputs } from "@/pages/appointments";
import { getDateToStr } from "@/utils/date";
import SearchUserSelect from "@/components/common/inputs/SearchUserSelect";
import { useAppSelector } from "@/store";

type Props = {
  handleSearch: (searchInputs: AppointmentSearchInputs) => void;
};

export default function SearchAppointmentContent({ handleSearch }: Props) {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { webLang } = useContext(LanguageContext);

  const [searchInputs, setSearchInput] = useState<{
    search_p_name: string;
    search_person: number;
    search_date: null | Value;
  }>({
    search_p_name: "",
    search_person: 0,
    search_date: null,
  });

  const setDate = (value: Value) => {
    if (!Array.isArray(value)) {
      setSearchInput((prev) => ({
        ...prev,
        search_date: value,
      }));
    }
  };

  const handleClickSearch = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const { search_p_name, search_person } = searchInputs;
    handleSearch({
      search_p_name,
      search_person,
      search_date: searchInputs.search_date
        ? getDateToStr(searchInputs.search_date, "-")
        : "",
    });
  };

  const setSelectedPerson = (id: number) =>
    setSearchInput((prev) => ({ ...prev, search_person: id }));

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;
    const { name, value } = target;
    setSearchInput((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="search-area" onSubmit={handleClickSearch}>
      <div className="search-box flex">
        <div className="flex gap-10 justify-between w-full">
          <div className="flex item-row align-center">
            <span className="flex flex-end">
              {langFile[webLang].APPOINTMENTS_DATE_TEXT}
              {/* 진행일자 */}
            </span>

            <DateInput
              onComplete={setDate}
              value={searchInputs.search_date}
              range={false}
              disabled={false}
            />
          </div>

          <div className="flex item-row align-center">
            <label htmlFor="search_p_name">
              {langFile[webLang].APPOINTMENTS_PT_NAME_TEXT}
              {/* 환자명 */}
            </label>

            <input
              className="search-box-input"
              type="text"
              name="search_p_name"
              id="search_p_name"
              value={searchInputs.search_p_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex item-row h-full justify-between  align-center">
            <span className="flex gap-3 justify-end">
              {langFile[webLang].APPOINTMENTS_SEARCH_CONTENT_MEDICAL_STAFF}
              {/* 의료진 */}
            </span>

            <SearchUserSelect
              o_idx={userInfo.country !== "korea" && userInfo.o_idx}
              setSelectedPerson={setSelectedPerson}
              value={searchInputs.search_person}
            />
          </div>

          <button className="primary-btn search-btn" type="submit">
            {langFile[webLang].SEARCH_BUTTON_TEXT}
            {/* 조회 */}
          </button>
        </div>
      </div>
    </form>
  );
}
