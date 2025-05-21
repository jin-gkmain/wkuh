import React from 'react';
import { IoLockClosedOutline } from 'react-icons/io5';

type props = {
  className?: string;
};

export default function LockClosed({ className }: props) {
  return <IoLockClosedOutline className={className ? className : ''} />;
}
