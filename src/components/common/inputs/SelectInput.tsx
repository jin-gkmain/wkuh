import UsersInnerModal, {
  UsersInnerModalJobType,
} from '@/components/modal/UsersInnerModal';
import useModal from '@/hooks/useModal';
import React, { useContext } from 'react';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';

type Props = {
  o_idx: number;
  selectedUserId?: number;
  label?: boolean;
  valueKey?: string;
  selected: string;
  onClick?: () => void;
  onSelect?: (data: User, key?: string) => void;
  disabled?: boolean;
  alert?: boolean;
  usersJobType?: UsersInnerModalJobType;
};

function SelectInput({
  o_idx,
  valueKey,
  selected,
  onSelect,
  disabled = false,
  label = false,
  alert = false,
  usersJobType,
}: Props) {
  const { lang } = useContext(LanguageContext);
  const { ModalPortal, openModal, closeModal } = useModal();

  const handleSelect = (user: User) => {
    if (onSelect) onSelect(user, valueKey);
  };

  return (
    <>
      <div
        className={`select-input input ${disabled ? 'input-disabled' : ''} ${
          alert ? 'alert-border-color' : ''
        }`}
      >
        <ModalPortal>
          <UsersInnerModal
            job={usersJobType}
            closeModal={closeModal}
            onSelect={handleSelect}
            o_idx={o_idx}
          />
        </ModalPortal>

        {selected && <span>{selected}</span>}
        {!selected && label && (
          <span className="select-default-text">
            {langFile[lang].SEARCH_INPUT_PLACEHOLDER}
            {/* 검색 버튼을 클릭하여 담당자를 선택해 주세요 */}
          </span>
        )}
        {!selected && !label && <span></span>}
        <button
          className="font-bold"
          onClick={openModal}
          disabled={disabled}
          type="button"
        >
          {langFile[lang].SEARCH_INPUT_BUTTON}
          {/* 검색 */}
        </button>
      </div>
    </>
  );
}

export default React.memo(SelectInput);
