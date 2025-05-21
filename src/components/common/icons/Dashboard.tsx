import { MdSpaceDashboard } from 'react-icons/md';

type props = {
  className?: string;
};

export default function Dashboard({ className }: props) {
  return <MdSpaceDashboard className={className ? className : ''} />;
}
