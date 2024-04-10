import styled from 'styled-components';

export const StyledUIFlashItem = styled.div`
  background: #3e3e3e;
  box-shadow: 0px 11px 14px rgba(11, 19, 33, 0.16);
  border-radius: 6px;
  position: relative;
  margin: 10px 0;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: left;
`;

export const FlashText = styled.span`
  font-family: 'Inter';
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  margin: 8px 0 8px 8px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
