import { CiMedicalCross } from 'react-icons/ci';

type props = {
  className?: string;
};

export default function Cross({ className }: props) {
  return <CiMedicalCross className={className ? className : ''} />;
}
