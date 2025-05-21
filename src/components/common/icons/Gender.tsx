import React from 'react';
import { BsGenderMale } from 'react-icons/bs';

type props = {
  className?: string;
};

export default function Gender({ className }: props) {
  return <BsGenderMale className={className ? className : ''} />;
}
