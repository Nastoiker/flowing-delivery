import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;
const GridEL = styled.div`
  margin: 0 auto;
`;
type Props = {
  allRows: any[];
  hasNextPage: boolean;
};
export const withGridWrapperCards = (Card) => (props: Props) => {
  const { allRows } = props;
  return (
    <Wrapper>
      {allRows.map((o) => (
        <GridEL key={o.id}>
          <Card order={o} />
        </GridEL>
      ))}
    </Wrapper>
  );
};
