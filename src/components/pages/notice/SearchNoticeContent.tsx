import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';
import DateInput, { Value } from '@/components/common/inputs/DateInput';
import { NoticeSearchInputs } from '@/pages/notice';
import { getDateToStr } from '@/utils/date';

type Props = {
  handleSearch: (searchInputs: NoticeSearchInputs) => void;
};
export default function SearchNoticeContent({ handleSearch }: Props) {
  const { lang } = useContext(LanguageContext);
  const [searchInputs, setSearchInput] = useState<{
    search_title: string;
    search_content: string;
    search_date: null | Value;
  }>({
    search_title: '',
    search_date: null,
    search_content: '',
  });

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;
    const { name, value } = target;
    setSearchInput((prev) => ({ ...prev, [name]: value }));
  };

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
    handleSearch({
      ...searchInputs,
      search_date: searchInputs.search_date
        ? getDateToStr(searchInputs.search_date, '-')
        : '',
    });
  };

  return (
    <form className="search-area" onSubmit={handleClickSearch}>
      <div className="search-box flex">
        <div className="flex item-row align-center">
          <label htmlFor="search_title">
            {langFile[lang].NOTICE_TITLE_TEXT}
            {/** 제목 */}
          </label>
          <input
            className="search-box-input"
            type="text"
            name="search_title"
            id="search_title"
            value={searchInputs.search_title}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex item-row align-center">
          <span>
            {langFile[lang].USER_REGIST_DATE_TEXT}
            {/** 등록일 */}
          </span>
          <DateInput
            onComplete={setDate}
            value={searchInputs.search_date}
            range={false}
            disabled={false}
          />
        </div>

        <div className="flex item-row align-center">
          <label htmlFor="search_content">
            {langFile[lang].NOTICE_CONTENTS_TEXT}
            {/** 내용 */}
          </label>
          <input
            className="search-box-input"
            type="text"
            name="search_content"
            id="search_content"
            value={searchInputs.search_content}
            onChange={handleInputChange}
          />
        </div>

        <button className="primary-btn search-btn" type="submit">
          {langFile[lang].SEARCH_BUTTON_TEXT}
          {/* 조회 */}
        </button>
      </div>
    </form>
  );
}
