import React from 'react';
import { IoTrashOutline } from 'react-icons/io5';

type props = {
  className?: string;
};

export default function Trash({ className }: props) {
  return <IoTrashOutline className={className ? className : ''} />;
}
