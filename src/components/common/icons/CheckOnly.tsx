import React from 'react';
import { FaCheck } from 'react-icons/fa6';

type props = {
  className?: string;
};

export default function CheckOnly({ className }: props) {
  return <FaCheck className={className ? className : ''} />;
}
