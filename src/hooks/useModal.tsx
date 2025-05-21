import React, {
  useRef,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';

const useModal = () => {
  const [modalOpened, setModalOpened] = useState(false);

  const openModal = useCallback(() => {
    setModalOpened(true);
  }, []);

  const closeModal = () => {
    setModalOpened(false);
  };

  const ModalPortal = ({ children }: { children: ReactNode }) => {
    const ref = useRef<Element | null>();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      if (document) {
        const dom = document.querySelector('#root-modal');
        ref.current = dom;
      }
    }, []);

    if (ref.current && mounted && modalOpened) {
      return createPortal(
        <div className="modal-container">
          <div
            className="modal-background"
            role="presentation"
            onClick={closeModal}
          />
          {children}
        </div>,
        ref.current
      );
    }
    return null;
  };

  return {
    modalOpened,
    openModal,
    closeModal,
    ModalPortal,
  };
};

export default useModal;
