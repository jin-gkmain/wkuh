import React from 'react';
import { BiSolidDownload } from 'react-icons/bi';

type props = {
  className?: string;
};

export default function Download({ className }: props) {
  return <BiSolidDownload className={className ? className : ''} />;
}
