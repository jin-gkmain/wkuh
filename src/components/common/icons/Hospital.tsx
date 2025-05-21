import React from 'react';
import { FaRegHospital } from 'react-icons/fa';

type props = {
  className?: string;
};

export default function Hospital({ className }: props) {
  return <FaRegHospital className={className ? className : ''} />;
}
