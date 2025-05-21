import { CiEdit } from 'react-icons/ci';

type props = {
  className?: string;
};

export default function Edit({ className }: props) {
  return <CiEdit className={className ? className : ''} />;
}
