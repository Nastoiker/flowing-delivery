import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  margin: auto;
`;

const Heading = styled.h1`
  font-size: 9rem;
`;

const Text = styled.p`
  font-size: 2rem;
  margin: 2.5rem 0;
`;
export const NotFoundErrorPage = () => {
  return (
    <Container>
      <Heading>404</Heading>
      <Text>К сожалению, ничего не найдено</Text>
      <Link to={`/menu`}>
        <Text>Вернуться на главную</Text>
      </Link>
    </Container>
  );
};
