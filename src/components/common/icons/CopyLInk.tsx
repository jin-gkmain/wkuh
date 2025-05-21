import Image from 'next/image';
import React from 'react';
import CopyLinkUrl from '../../../../public/images/copyLink.png';

export default function CopyLink({ classname }: { classname?: string }) {
  return (
    <Image
      src={CopyLinkUrl}
      alt="copyLinkImage"
      width={16}
      height={16}
      className={classname ? classname : ''}
    />
  );
}
