import { createContext } from 'react';

type WorkflowModalState = {
  isOpened: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const WorkflowModalContext = createContext<WorkflowModalState>({
  isOpened: false,
  closeModal() {},
  openModal() {},
});
