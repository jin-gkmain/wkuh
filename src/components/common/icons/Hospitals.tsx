import { FaRegHospital } from 'react-icons/fa6';

type props = {
  className?: string;
};

export default function Hospitals({ className }: props) {
  return <FaRegHospital className={className ? className : ''} />;
}
