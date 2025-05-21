import React from 'react';
import { GoQuestion } from 'react-icons/go';

type props = {
  className?: string;
};

export default function Question({ className }: props) {
  return <GoQuestion className={className ? className : ''} />;
}
