import React from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

type props = {
  className?: string;
};

export default function Check({ className }: props) {
  return <IoMdCheckmarkCircleOutline className={className ? className : ''} />;
}
