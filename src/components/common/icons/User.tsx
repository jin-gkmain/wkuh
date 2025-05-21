import React from 'react';
import { FaUser } from 'react-icons/fa';

type Props = {
  className?: string;
  roundBg?: boolean;
};

export default function User({ className, roundBg }: Props) {
  return (
    <span className={roundBg ? 'user-round' : ''}>
      <FaUser className={className ? className : ''} />
    </span>
  );
}
