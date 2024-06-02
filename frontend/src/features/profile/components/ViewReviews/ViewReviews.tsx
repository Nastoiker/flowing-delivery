import { useMyReviews } from "@/entities/review/hooks/useReview";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { UserReview } from "./UserReview";
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
          <UserReview review={f} />
          <Box paddingLeft="15px">
            {f.status ? (
              <Typography sx={{ color: "green" }}>
                {REVIEWS_LABEL[f.status]}
              </Typography>
            ) : (
              <Typography> не проверено</Typography>
            )}
          </Box>
        </GridEL>
      ))}
    </Wrapper>
  );
};
