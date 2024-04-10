import { useCallback, useState } from "react";

type Props = {
  initialOpen?: boolean;
  afterOpen?: () => void;
  afterClose?: () => void;
};

export const useModalState = ({
  initialOpen = false,
  afterOpen,
  afterClose,
}: Props = {}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    afterOpen?.();
  }, [afterOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    afterClose?.();
  }, [afterClose]);

  const onToggle = useCallback(() => {
    const newValue = !isOpen;
    setIsOpen(newValue);
    if (newValue) {
      afterOpen?.();
    } else {
      afterClose?.();
    }
  }, [isOpen, afterOpen, afterClose]);

  return { onOpen, onClose, isOpen, onToggle };
};
