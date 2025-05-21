import React from 'react';
import { IoLogOutOutline } from 'react-icons/io5';

type props = {
  className?: string;
};

export default function Logout({ className }: props) {
  return <IoLogOutOutline className={className ? className : ''} />;
}
