import React from 'react';
import { IoClose } from 'react-icons/io5';

type props = {
  className?: string;
  onClose: () => void;
};

export default function Close({ className, onClose }: props) {
  return (
    <IoClose
      className={className ? className : ''}
      onClick={onClose}
      style={{ zIndex: 1 }}
    />
  );
}
