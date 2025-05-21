import React from 'react';
import { IoQrCode } from "react-icons/io5";

type props = {
  className?: string;
};

export default function Qr({ className }: props) {
  return (
    <IoQrCode
      className={className ? className : ''}
    />
  );
}
