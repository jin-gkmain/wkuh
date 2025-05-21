import React, { FormEvent, ReactNode, useContext } from 'react';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';

type Props = {
  children: ReactNode;
  handleRefresh: () => void;
  handleSearch: (ev?: FormEvent<HTMLFormElement>) => void;
};

export default function SearchZoneFrame({
  children,
  handleRefresh,
  handleSearch,
}: Props) {
  const { lang } = useContext(LanguageContext);
  return (
    <form className="search-area" onSubmit={handleSearch}>
      <div className="search-box flex">{children}</div>

      <div className="buttons flex justify-end">
        <button className="refresh-btn" type="button" onClick={handleRefresh}>
          {langFile[lang].REFRESH_BUTTON_TEXT}
          {/** 새로고침 */}
        </button>
        <button className="primary-btn search-btn" type="submit">
          {langFile[lang].SEARCH_BUTTON_TEXT}
          {/** 조회 */}
        </button>
      </div>
    </form>
  );
}
