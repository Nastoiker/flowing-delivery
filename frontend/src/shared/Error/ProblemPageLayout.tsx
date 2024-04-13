import styled from "styled-components";
import { useOnAMobileDevice } from "../hooks/useOnAMobileDevice";
import { useAppThunkDispatch } from "../store/hooks";
import {
  Container,
  ContentContainer,
  ErrorExplanation,
  ErrorFixStepsList,
  ErrorFixStepsListItem,
  ErrorTitle,
  GoToMainButton,
  SupportContainer,
  Wrapper,
} from "./styled";

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  @media screen and (max-width: 759px) {
    flex-direction: column;
    justify-content: center;
    gap: 15px;
  }
`;

interface Props {
  title: string;
}

export const ProblemPageLayout = ({ title }: Props) => {
  const dispatch = useAppThunkDispatch();

  const isMobile = useOnAMobileDevice();

  // useEffect(() => {
  //   dispatch(fetchCurrentUser());
  // }, []);

  return (
    <Wrapper>
      <ContentContainer $isPickup={true}>
        <ErrorTitle>{title}</ErrorTitle>
        <Container>
          <SupportContainer>
            <ErrorExplanation>
              Извините, что-то пошло не так...
            </ErrorExplanation>
            <ErrorFixStepsList $title="Тем временем Вы можете:">
              <ErrorFixStepsListItem>
                {isMobile
                  ? "Обновить страницу, нажав на кнопку ниже"
                  : "Обновить страницу сочетанием клавиш Ctrl + Shift + R, или нажав на кнопку ниже"}
              </ErrorFixStepsListItem>
              <ErrorFixStepsListItem>
                Позвонить или написать в поддержку
              </ErrorFixStepsListItem>
              <ErrorFixStepsListItem>
                Вернуться на главную
              </ErrorFixStepsListItem>
            </ErrorFixStepsList>
          </SupportContainer>
          <ButtonsWrapper>
            <GoToMainButton onClick={() => window.location.reload()}>
              Обновить страницу
            </GoToMainButton>
            <GoToMainButton onClick={() => window.location.assign("/home")}>
              На главную
            </GoToMainButton>
          </ButtonsWrapper>
        </Container>
      </ContentContainer>
    </Wrapper>
  );
};
