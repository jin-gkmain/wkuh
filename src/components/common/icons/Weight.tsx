import React from 'react';
import { LiaWeightSolid } from 'react-icons/lia';

type props = {
  className?: string;
};

export default function Weight({ className }: props) {
  return <LiaWeightSolid className={className ? className : ''} />;
}
