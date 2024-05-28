import { Review } from "@/entities/review/components/Review";
import { useMyReviews } from "@/entities/review/hooks/useReview";
import { useState } from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;
const GridEL = styled.div`
  margin: 0 auto;
`;
export const ViewReviews = () => {
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });

  const { data, isError } = useMyReviews({ sort });
  if (isError || !data) {
    return null;
  }
  return (
    <Wrapper>
      {data?.data?.reviews?.map((f) => (
        <GridEL key={f.id}>
          <Review review={f} />
        </GridEL>
      ))}
    </Wrapper>
  );
};
