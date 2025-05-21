import React from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';

type Props = {
  className?: string;
  handleClick: () => void;
};

export default function Global({ className, handleClick }: Props) {
  return (
    <AiOutlineGlobal
      onClick={handleClick}
      className={className ? className : ''}
    />
  );
}
