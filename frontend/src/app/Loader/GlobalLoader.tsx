import { useIsFetching } from "react-query";
import styled from "styled-components";
import { Loader } from "./Loader";
const Wrapper = styled.div`
  display: flex;
  margin: 80px;
  justify-content: center;
`;
export const GlobalLoader = () => {
  const isFetching = useIsFetching();

  return isFetching ? (
    <Wrapper>
      <Loader size={"5rem"} />
    </Wrapper>
  ) : null;
};
