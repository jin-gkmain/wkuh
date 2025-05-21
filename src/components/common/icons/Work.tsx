import { BsPencilSquare } from 'react-icons/bs';

type props = {
  className?: string;
};

export default function Work({ className }: props) {
  return <BsPencilSquare className={className ? className : ''} />;
}
