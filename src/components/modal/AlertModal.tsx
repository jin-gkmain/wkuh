import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function AlertModal() {
  const ref = useRef<Element | null>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (document) {
      const dom = document.querySelector('#sub-modal');
      ref.current = dom;
    }
  }, []);

  if (ref.current && mounted) {
    return createPortal(
      <div className="modal-container">
        <div
          className="modal-background"
          role="presentation"
          // onClick={closeModal}
        />
        {/* {children} */}
      </div>,
      ref.current
    );
  }

  return null;
}
