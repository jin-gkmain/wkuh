import React from 'react';
import { LiaUserNurseSolid } from 'react-icons/lia';

type props = {
  className?: string;
};

export default function Nurse({ className }: props) {
  return <LiaUserNurseSolid className={className ? className : ''} />;
}
