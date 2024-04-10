import { Box } from '@material-ui/core';
import type { ElementType } from 'react';
import { FlashText, StyledUIFlashItem } from './styles';

type FlashItemUIProps = {
  message: string;
  Icon: ElementType;
};

export const FlashItemUI = ({ message, Icon }: FlashItemUIProps) => (
  // className для тестов лежит
  <StyledUIFlashItem className="flash-item">
    <Box display="flex" alignItems="center" justifyContent="center">
      <Icon />
    </Box>
    <FlashText
      className="flash-text"
      dangerouslySetInnerHTML={{
        __html: message,
      }}
    />
  </StyledUIFlashItem>
);
