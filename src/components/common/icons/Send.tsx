import React from 'react';
import { FiSend } from 'react-icons/fi';
type props = {
  className?: string;
};

export default function Send({ className }: props) {
  return <FiSend className={className ? className : ''} />;
}
