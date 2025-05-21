import React, { MutableRefObject, useCallback, useEffect } from 'react';
import Edit from './icons/Edit';
import Trash from './icons/Trash';
import Logout from './icons/Logout';
import LockClosed from './icons/LockClosed';

type Props<T> = {
  dropRef: MutableRefObject<null | HTMLElement>;
  onClose: () => void;
  options: DropdownOption<T>[];
  onClick: (type: T) => void;
};

export default function DropdownOptions<T extends string>({
  options,
  dropRef,
  onClose,
  onClick,
}: Props<T>) {
  const clickEvent = useCallback(
    (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      if (target && !dropRef.current?.contains(target)) {
        onClose();
      }
    },
    [dropRef, onClose]
  );

  useEffect(() => {
    document.addEventListener('click', clickEvent);

    return () => {
      document.removeEventListener('click', clickEvent);
    };
  }, [clickEvent]);

  return (
    <ul className="dropdown-options-box">
      {options.map(({ text, type, allowed }) => (
        // <li
        //   key={text}
        //   onClick={() => onClick(type)}
        //   className={`flex align-center justify-start ${
        //     allowed ? 'allowed' : 'not-allowed'
        //   }`}
        // >
        <li
          key={text}
          onClick={() => onClick(type)}
          className={`flex align-center justify-start allowed`}
        >
          <span className="flex align-center gap-5">
            {type === 'manage' && <Edit />}
            {type === 'remove' && <Trash />}
            {type === 'logout' && <Logout />}
            {type === 'password' && <LockClosed />}
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
}
