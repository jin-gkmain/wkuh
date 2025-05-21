import React from 'react';
import { GiBodyHeight } from 'react-icons/gi';

type props = {
  className?: string;
};

export default function Height({ className }: props) {
  return <GiBodyHeight className={className ? className : ''} />;
}
