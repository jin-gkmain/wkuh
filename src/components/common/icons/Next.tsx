import { MdNavigateNext } from 'react-icons/md';

type props = {
  className?: string;
};

export default function Next({ className }: props) {
  return <MdNavigateNext className={className ? className : ''} />;
}
