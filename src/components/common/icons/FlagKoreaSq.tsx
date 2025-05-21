import Image from 'next/image';
import React from 'react';

type Props = {
  width?: number;
  height?: number;
};

export default function FlagKoreaSq({ width, height }: Props) {
  return (
    <Image
      src={'/images/flag_korea_sq.png'}
      width={width ? width : 12}
      height={height ? height : 12}
      alt="flag_korea"
    />
  );
}
