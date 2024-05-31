import { Review } from "@/entities/review/components/Review";
import { useMyReviews } from "@/entities/review/hooks/useReview";
import { Box, Typography } from "@mui/material";
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
enum ReviewsValues {
  NOT_VERIFED,
  VERIFED = 1,
}
const REVIEWS_LABEL = {
  [ReviewsValues.NOT_VERIFED]: "Не проверено",
  [ReviewsValues.VERIFED]: "Проверено",
};
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
          <Box paddingLeft="15px">
            <Typography>
              {f.status ? REVIEWS_LABEL[f.status] : "Не проверено"}
            </Typography>
          </Box>
        </GridEL>
      ))}
    </Wrapper>
  );
};
