import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

type props = {
  className?: string;
};

export default function Phone({ className }: props) {
  return <FaPhoneAlt className={className ? className : ''} />;
}
