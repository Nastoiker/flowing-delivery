import type { CSSProperties } from "styled-components";
import styled, { css } from "styled-components";
import { MODAL_Z_INDEX } from "../constants/themes";

export const Wrapper = styled.div`
  display: flex;
  position: fixed;
  background-color: white;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: ${MODAL_Z_INDEX};
`;

export const ContentContainer = styled.div<{ $isPickup?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: ${({ $isPickup }) => ($isPickup ? "40px 80px 120px" : "40px 80px")};

  @media (max-width: 639px) {
    padding: ${({ $isPickup }) => ($isPickup ? "40px 16px 80px" : "40px 16px")};
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  max-width: 720px;
  height: 100%;
  background-color: #fff;
`;

export const CloudContainer = styled.div`
  width: 506px;
  height: 405px;

  @media (max-width: 639px) {
    width: 343px;
    height: 275px;
  }
`;

export const ErrorTitle = styled.h4`
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 60px;
  line-height: 74px;
  text-align: center;
  color: #1f64e7;
  margin-top: -74px;
  margin-bottom: 24px;

  @media (max-width: 639px) {
    margin-top: -49px;
    font-size: 40px;
    line-height: 48px;
  }
`;

export const ErrorExplanation = styled.span<{
  $textAlign?: CSSProperties["textAlign"];
}>`
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: #3f3f3f;
  text-align: ${({ $textAlign }) => $textAlign || "start"};

  @media (max-width: 639px) {
    font-size: 16px;
    line-height: 19.5px;
  }
`;

export const ErrorFixStepsList = styled.ul<{ $title?: string }>`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  list-style-position: inside;

  ${({ $title }) =>
    $title &&
    `
    & li {
      margin-left: 40px;

      @media (max-width: 639px) {
        margin-left: 20px;
      }
    }

    &:before {
      content: '${$title}';
      font-family: 'Montserrat', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
      color: #3f3f3f;

      @media (max-width: 639px) {
        font-size: 16px;
        line-height: 19.5px;
      }
    }
  `}
`;

export const ErrorFixStepsListItem = styled.li`
  font-family: "Montserrat", sans-serif;
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  color: #3f3f3f;
  text-align: start;

  @media (max-width: 639px) {
    font-size: 16px;
    line-height: 19.5px;
  }
`;

export const SupportContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 24px;
`;

export const LinksContainer = styled.div`
  display: flex;
  grid-gap: 32px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  @media (max-width: 639px) {
    flex-direction: column;
    justify-content: space-between;
    grid-gap: 16px;
  }
`;

export const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-gap: 8px;
`;

const linksTextStyled = css`
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #6765f2;
`;

export const SocialLinkText = styled.span`
  ${linksTextStyled}
`;

export const SocialLinksContainer = styled.div`
  display: flex;
  gap: 8px;
  bottom: 32px;
  align-items: center;
  justify-content: center;

  & a {
    display: flex;
  }

  & ${SocialLinkText} {
    text-transform: none;
  }
`;

export const Phone = styled.a`
  ${linksTextStyled}
`;

export const GoToMainButton = styled.button`
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 28px;
  text-transform: uppercase;
  width: 343px;
  height: 60px;
  color: #fff;
  background: #6765f2;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
`;
