import NotFoundImg from "@/assets/not-found.png";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
const Container = styled.div`
  text-align: center;
  margin: auto;
`;

const Heading = styled.h1`
  font-size: 9rem;
`;
const WrapperText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Text = styled.p`
  font-size: 2rem;
  margin: 2.5rem 0;
`;
export const NotFoundErrorPage = () => {
  return (
    <Container>
      <WrapperText>
        <Heading>4</Heading>
        <img
          style={{ maxWidth: "150px", maxHeight: "150px" }}
          src={NotFoundImg}
        />
        <Heading>4</Heading>
      </WrapperText>
      <Text>К сожалению, ничего не найдено</Text>
      <Link to={`/menu`}>
        <Button size="large">Вернуться на главную</Button>
      </Link>
    </Container>
  );
};
