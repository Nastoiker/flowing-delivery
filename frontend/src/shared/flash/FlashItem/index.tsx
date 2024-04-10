import { ReactComponent as CircleCheckIcon } from 'images/designer-icons/circle-check-green.svg';
import { ReactComponent as CircleCrossIcon } from 'images/designer-icons/circle-cross-red.svg';
import { ReactComponent as CircleInfoIcon } from 'images/designer-icons/circle-info.svg';
import { ReactComponent as CircleWarningIcon } from 'images/designer-icons/circle-warning-red.svg';
import type { ElementType } from 'react';
import { useEffect, useMemo } from 'react';
import { removeFlash } from 'store/actions/flash';
import { useAppThunkDispatch } from 'store/hooks';
import { FlashItemUI } from './FlashItemUI';

export type FlashType = 'success' | 'warning' | 'error' | 'maintenance';

const flashIcons: {
  [key in FlashType]: ElementType;
} = {
  success: CircleCheckIcon,
  warning: CircleWarningIcon,
  error: CircleCrossIcon,
  maintenance: CircleInfoIcon,
};

type FlashItemProps = {
  flash: {
    type: FlashType;
    id: number;
    message: any;
  };
  timeout: number;
};

export const FlashItem = ({ flash, timeout }: FlashItemProps) => {
  const dispatch = useAppThunkDispatch();

  const Icon = useMemo(() => flashIcons[flash.type] || null, [flash.type]);

  useEffect(() => {
    const customTimeout = timeout || (flash.type === 'maintenance' ? 8000 : 3000);

    setTimeout(() => {
      dispatch(removeFlash(flash.id));
    }, customTimeout);
  }, []);

  return (
    <FlashItemUI
      message={typeof flash.message === 'object' ? '' : flash.message?.replace(/\n/g, '<br />')}
      Icon={Icon}
    />
  );
};
