import React from 'react';
import { TbSpeakerphone } from 'react-icons/tb';

type props = {
  className?: string;
};

export default function Speaker({ className }: props) {
  return <TbSpeakerphone className={className ? className : ''} />;
}
