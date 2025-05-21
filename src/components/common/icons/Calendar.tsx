import React from 'react';
import { CiCalendar } from 'react-icons/ci';

type props = {
  className?: string;
};

export default function Calendar({ className }: props) {
  return <CiCalendar className={className ? className : ''} />;
}
