import React from 'react';
import { CiStethoscope } from 'react-icons/ci';

type props = {
  className?: string;
};

export default function Stethoscope({ className }: props) {
  return <CiStethoscope className={className ? className : ''} />;
}
