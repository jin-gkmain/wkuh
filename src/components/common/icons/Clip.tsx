import { GoPaperclip } from 'react-icons/go';

type props = {
  className?: string;
};

export default function Clip({ className }: props) {
  return <GoPaperclip className={className ? className : ''} />;
}
