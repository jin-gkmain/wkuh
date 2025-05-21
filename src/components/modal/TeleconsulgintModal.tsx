import React, { useContext } from 'react';
import ModalFrame from './ModalFrame';
import { TeleconsultingModalContext } from '@/context/TeleconsultingContext';

export default function TeleconsulgintModal() {
  const { closeModal } = useContext(TeleconsultingModalContext);
  return (
    <div className="teleconsulting-modal">
      <ModalFrame
        onClose={closeModal}
        title="원격협진 Room"
        chatting={false}
        hideBtns
      >
        <div></div>
      </ModalFrame>
    </div>
  );
}
