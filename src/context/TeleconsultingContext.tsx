import { createContext } from 'react';

type TeleconsultingModalState = {
  isOpened: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const TeleconsultingModalContext =
  createContext<TeleconsultingModalState>({
    isOpened: false,
    closeModal() {},
    openModal() {},
  });
