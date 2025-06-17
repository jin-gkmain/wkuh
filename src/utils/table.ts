import { LangType } from '@/context/LanguageContext';
import langFile from '@/lang';

export default function getTableRowMenuOptions(
  options: 'remove' | 'manage' | 'all' | '',
  lang: LangType
): DropdownOption<TableMenuOption>[] {
  const tableMenuOptions: DropdownOption<TableMenuOption>[] = [];
  if (options === 'remove') {
    tableMenuOptions.push({
      text: langFile[lang].DROP_REMOVE_TEXT, // 삭제하기
      type: 'remove',
    });
  } else if (options === 'manage') {
    tableMenuOptions.push({
      text: langFile[lang].DROP_EDIT_TEXT, // 수정하기
      type: 'manage',
    });
  } else if (options === 'all') {
    tableMenuOptions.push({
      text: langFile[lang].DROP_REMOVE_TEXT, // 삭제하기
      type: 'remove',
    });
    tableMenuOptions.push({
      text: langFile[lang].DROP_EDIT_TEXT, // 수정하기
      type: 'manage',
    });
  }

  return tableMenuOptions;
}

export function getTableDropMenuOptions(
  options: TableMenuOption[] | 'all',
  lang: LangType
): DropdownOption<TableMenuOption>[] {
  const allOptions: DropdownOption<TableMenuOption>[] = [
    {
      text: langFile[lang].DROP_REMOVE_TEXT, // 삭제하기
      type: 'remove',
    },
    {
      text: langFile[lang].DROP_EDIT_TEXT, // 수정하기
      type: 'manage',
    },
    {
      text: langFile[lang].DROP_DISABELD_TEXT, // 비활성화하기
      type: 'disabled',
    },
    {
      text: langFile[lang].DROP_ACTIVATE_TEXT, // 활성화하기
      type: 'activate',
    },
  ];
  let tableMenuOptions: DropdownOption<TableMenuOption>[] = [];

  if (options === 'all') {
    tableMenuOptions = [...allOptions];
  } else {
    options.forEach((o) => {
      const matched = allOptions.find((op) => op.type === o);
      tableMenuOptions.push(matched);
    });
  }

  return tableMenuOptions;
}
