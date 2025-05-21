import React from 'react';
import { MdOutlineEmail } from 'react-icons/md';

type props = {
  className?: string;
};

export default function Email({ className }: props) {
  return <MdOutlineEmail className={className ? className : ''} />;
}
