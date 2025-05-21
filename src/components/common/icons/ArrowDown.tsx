import React from 'react';
import { FaAngleDown } from 'react-icons/fa6';

type props = {
  className?: string;
};

export default function ArrowDown({ className }: props) {
  return <FaAngleDown className={className ? className : ''} />;
}
