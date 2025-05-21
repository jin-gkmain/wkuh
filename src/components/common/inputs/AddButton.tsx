import React from 'react';
import Plus from '../icons/Plus';

type Props = {
  onClick: () => void;
  text: string;
  show?: boolean;
};

export default function AddButton({ onClick, text, show = true }: Props) {
  return (
    <div className="add-button">
      {show ? (
        <button
          className="primary-btn flex align-center justify-between font-bold"
          onClick={onClick}
        >
          {text}
          <Plus className="font-bold icon-medium" />
        </button>
      ) : null}
    </div>
  );
}
