import React from 'react';
import { CiLocationOn } from 'react-icons/ci';

type props = {
  className?: string;
};

export default function Location({ className }: props) {
  return <CiLocationOn className={className ? className : ''} />;
}
