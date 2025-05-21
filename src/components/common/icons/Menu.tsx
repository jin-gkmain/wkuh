import Image from 'next/image';
import { CiMenuKebab } from 'react-icons/ci';
import menuIconSrc from '../../../../public/images/menuIcon.png';

type props = {
  className?: string;
};

export default function Menu({ className }: props) {
  return <Image src={menuIconSrc} width={5} height={18} alt="menuIcon" />;
}
