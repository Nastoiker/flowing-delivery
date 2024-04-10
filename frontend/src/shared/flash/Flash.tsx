import { useAppSelector } from 'store/hooks';
import styled from 'styled-components';
import { FlashItem } from './FlashItem';

const StyledFlash = styled.div`
  position: fixed;
  top: 55px;
  left: 10px;
  width: 100%;
  max-width: 300px;
  z-index: ${(props) => props.theme.variables.flashZIndex + 100} !important;
`;

export const Flash = () => {
  const flashes = useAppSelector((state) => state.flashes);

  return (
    // className для тестов лежит
    <StyledFlash className="flash-container">
      {flashes.map((flash) => (
        <FlashItem key={flash.id} flash={flash} timeout={flash.timeout} />
      ))}
    </StyledFlash>
  );
};
