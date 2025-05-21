import Image from 'next/image';
import React from 'react';

type Props = {
  title?: string;
  desc?: string;
  handleClose: () => void;
};

export default function CheckAlertbox({ title, desc, handleClose }: Props) {
  return (
    <div className="check-alert-box text-center flex flex-col align-center">
      <Image
        priority
        src={'/images/checkIcon.png'}
        alt="채크아이콘"
        width={110}
        height={110}
      />

      <div className="text-content">
        <h2>{title}</h2>

        <p>{desc}</p>
      </div>

      <button className="primary-btn" onClick={handleClose}>
        ok
      </button>
    </div>
  );
}
