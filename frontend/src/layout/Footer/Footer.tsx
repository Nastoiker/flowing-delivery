import { Button, Input, Typography } from "@mui/material";
import styled from "styled-components";

const StyledFooter = styled.footer`
  width: 100%;
  color: black;
  z-index: 50;
  padding: 20px;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
`;

const ContentWrapper = styled.div`
  display: flex;
  border-top: 2px solid green;
  padding-top: 20px;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const SubscribeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const StyledInput = styled(Input)`
  /* Добавьте стили для Input-компонента */
`;

const StyledButton = styled(Button)`
  /* Добавьте стили для Button-компонента */
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const PhoneLink = styled.a`
  text-decoration: none;
`;

const HR = styled.hr`
  margin: 5px 0;
  border-color: green;
`;

const BottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CopyrightLink = styled.a`
  text-decoration: none;
`;
const ContainerEmail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 0;
    justify-content: space-between;
    align-items: center;
  }
`;

export const Footer = (): JSX.Element => {
  return (
    <StyledFooter>
      <ContentWrapper>
        <ContainerEmail>
          <Typography>Хотите первым узнавать о скидках в FLOVEN?</Typography>
          <SubscribeWrapper>
            <StyledInput type="email" placeholder="Email" />
            <StyledButton>Подписаться</StyledButton>
          </SubscribeWrapper>
        </ContainerEmail>
        <FlexContainer>
          <ColumnWrapper>
            <Typography>ИНТЕРНЕТ-МАГАЗИН</Typography>
          </ColumnWrapper>
          <ColumnWrapper>
            <p>
              Телефон: <br />
              <PhoneLink href="tel:+7(900)-999-99-99">
                +7(900)-999-99-99
              </PhoneLink>
            </p>
          </ColumnWrapper>
        </FlexContainer>
        <HR className="green" />
        <BottomWrapper>
          <p>
            <CopyrightLink href="#" target="_blank">
              © 2004–2022 Группа компаний «FLOVEN»
            </CopyrightLink>
          </p>
        </BottomWrapper>
      </ContentWrapper>
    </StyledFooter>
  );
};
