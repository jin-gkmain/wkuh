import { ReactNode, useRef, useState, useEffect } from "react";
import Next from "../icons/Next";
import Menu from "../icons/Menu";
import DropdownOptions from "../DropdownOptions";
import { LangType } from "@/context/LanguageContext";
import { getTableDropMenuOptions } from "@/utils/table";
// import langFile from '@/lang';

type Props<M> = {
  buttonActive?: boolean;
  buttonText: string;
  handleClick: () => void;
  onClickMenu?: (type: string) => void;
  menu?: boolean;
  menuOptions?: DropdownOption<M>[];
  children?: ReactNode;

  rowDisabled?: boolean;
  tableRowOptionType?: TableMenuOption[];
  lang?: LangType;
};

export default function TableRow<M extends string>({
  buttonActive = true,
  buttonText,
  onClickMenu,
  handleClick,
  menuOptions,
  children,
  menu = true,

  rowDisabled = false,
  tableRowOptionType,
  lang,
}: Props<M>) {
  const [visible, setVisible] = useState(false);
  const [tableMenuOptions, setTableMenuOptions] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const menuDropRef = useRef<null | HTMLTableDataCellElement>(null);

  const handleMenuBtnClick = () => {
    if (!visible) return;
    setDropdown(!dropdown);
  };

  useEffect(() => {
    if (menuOptions) {
      if (menuOptions.length) setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (tableRowOptionType) {
      if (tableRowOptionType.length) setVisible(true);
      // if (!tableRowOptionType.length) setVisible(false);
      setTableMenuOptions(
        getTableDropMenuOptions(tableRowOptionType, lang as "ko" | "en")
      );
    }
  }, [lang, tableRowOptionType]);

  return (
    <tr className={`table-row ${rowDisabled ? "row-disabled" : ""}`}>
      {children}
      <td className="button">
        <button
          disabled={!buttonActive}
          type="button"
          onClick={handleClick}
          className={`table-btn primary-btn flex align-center font-semi-bold ${
            !buttonActive ? "table-btn-disabled" : ""
          }`}
        >
          {buttonText} <Next />
        </button>
      </td>

      {menu && (
        <td
          className={`menu-td relative ${visible ? "visible" : "hidden"}`}
          ref={menuDropRef}
          onClick={handleMenuBtnClick}
        >
          {dropdown && (
            <DropdownOptions
              options={
                menuOptions
                  ? menuOptions
                  : tableMenuOptions
                  ? tableMenuOptions
                  : []
              }
              onClose={() => setDropdown(false)}
              dropRef={menuDropRef}
              onClick={(type) => {
                onClickMenu(type);
              }}
            />
          )}
          <Menu className="menu" />
        </td>
      )}
    </tr>
  );
}

// function getTableDropMenuOptions(
//   options: TableMenuOption[] | 'all',
//   lang: 'ko' | 'en'
// ): DropdownOption<TableMenuOption>[] {
//   console.log('options > ', options);
//   const allOptions: DropdownOption<TableMenuOption>[] = [
//     {
//       text: langFile[lang].DROP_REMOVE_TEXT, // 삭제하기
//       type: 'remove',
//     },
//     {
//       text: langFile[lang].DROP_EDIT_TEXT, // 수정하기
//       type: 'manage',
//     },
//     {
//       text: langFile[lang].DROP_DISABELD_TEXT, // 비활성화하기
//       type: 'disabled',
//     },
//     {
//       text: langFile[lang].DROP_ACTIVATE_TEXT, // 활성화하기
//       type: 'activate',
//     },
//   ];
//   let tableMenuOptions: DropdownOption<TableMenuOption>[] = [];

//   if (options === 'all') {
//     tableMenuOptions = [...allOptions];
//   } else {
//     options.forEach((o) => {
//       const matched = allOptions.find((op) => op.type === o);
//       console.log('matched  > ', matched);
//       tableMenuOptions.push(matched);
//     });
//   }

//   return tableMenuOptions;
// }
