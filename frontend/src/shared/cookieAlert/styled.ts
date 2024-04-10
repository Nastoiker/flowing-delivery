import styled from '@emotion/styled';
import { Button } from '@mui/material';
// TODO: почему я не могу здесь использовтаь styled-components? приходится использовать emotion
export const Container = styled.div`
  background-color: #222222;
  font-family: Montserrat, sans-serif;
  position: absolute;
  bottom: -85px;
  left: 50%;
  z-index: 1000;
  transform: translate(-50%, calc(-100% - 16px));
  border-radius: 6px;
  display: flex;
  align-items: center;
  width: 580px;
  max-width: 100%;
  padding: 26px 24px;
  gap: 16px;
  @media screen and (max-width: 639px) {
    bottom: -91px;
    width: 100%;
    border-radius: 6px 6px 0 0;
    padding: 16px;
    gap: 8px;
  }
`;

export const Text = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 1.2;
  color: #ffffff;
  letter-spacing: 0;
  a {
    color: #b8b7ff;
    text-decoration: none;
  }

  @media screen and (max-width: 639px) {
    font-size: 12px;
  }
`;

export const StyledButton = styled(Button)`
  display: flex;
  padding: 10px 29px;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  width: 80px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.8;
  text-transform: none;

  background-color: #6765f2;

  box-shadow: none;
  border-radius: 4px;
  :active,
  :hover {
    background-color: #6765f2;
  }

  @media screen and (max-width: 639px) {
    width: 60px;
    padding: 10px 20px;
  }
`;
