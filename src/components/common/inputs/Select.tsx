import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ArrowDown from "../icons/ArrowDown";
import Hospital from "../icons/Hospital";
import Check from "../icons/Check";
import Image from "next/image";
import CheckOnly from "../icons/CheckOnly";
import { LanguageContext } from "@/context/LanguageContext";

export type SelectOptionType = {
  key: string;
  keyEn?: string;
  value: string;
};

type Props<T> = {
  disabled?: boolean;
  selectType: T;
  options: SelectOptionType[];
  selected: string;
  setSelected: <T>(selected: string, selectType: T) => void;
};

function Select<T extends string>({
  disabled,
  options,
  selected,
  selectType,
  setSelected,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const dropboxRef = useRef(null);
  const { lang } = useContext(LanguageContext);

  const handleModal = () => {
    if (disabled) return;
    setOpen(!open);
  };

  const onClick = (ev: React.MouseEvent<HTMLUListElement>) => {
    const target = ev.target;
    if (!(target instanceof HTMLLIElement)) return;
    setSelected(target.dataset.option!, selectType);
    setOpen(false);
  };

  const clickOutside = (ev: MouseEvent) => {
    const target = ev.target;
    if (target instanceof HTMLElement && dropboxRef.current) {
      const contained = (dropboxRef.current as HTMLElement).contains(target);
      if (!contained) setOpen(false);
    }
  };

  const getSelectedKey = useMemo(() => {
    const selectedItem = options.find((item) => item.value === selected);
    if (selectedItem) {
      if (lang === "en") {
        return selectedItem.keyEn ? selectedItem.keyEn : selectedItem.key;
      } else return selectedItem.key;
    }
  }, [lang, options, selected]);

  useEffect(() => {
    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [options]);

  return (
    <>
      <div
        className={`select input ${disabled ? "input-disabled" : ""}`}
        ref={dropboxRef}
      >
        <div
          className="flex justify-between h-full align-center selected-input"
          onClick={handleModal}
        >
          {selectType === "hospitalSelect" && (
            <Hospital className="select-hospital shrink-0" />
          )}
          <span className="flex-1">
            {/* {options.find((item) => item.value === selected)?.key} */}
            {getSelectedKey}
          </span>

          <ArrowDown />
        </div>

        {open && (
          <ul
            className="options"
            onClick={onClick}
            style={{ overflowY: "auto", maxHeight: "150px" }}
          >
            {options.map(({ key, keyEn, value }) => (
              <li
                key={value}
                data-option={value}
                className="flex justify-between align-center"
              >
                {keyEn ? (lang === "ko" ? key : keyEn) : key}
                {value === selected && <CheckOnly />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default React.memo(Select);
