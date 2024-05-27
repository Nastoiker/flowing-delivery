import { Review } from "@/entities/review/components/Review";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { IReview } from "@/shared/interfaces/review.interface";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import styled from "styled-components";

const Wrapper = styled.div``;
type Props = { reviews: IReview[]; onChangeSort: (field, dir) => void };
export const ReviewWrapper = ({ reviews, onChangeSort }: Props) => {
  const handleChangeSortByDate = (event) => {
    onChangeSort("createdAt", event.target.checked ? "desc" : "asc");
  };
  const currentUser = useCurrentUser();

  if (!reviews?.length) {
    return (
      <Typography variant="h4" padding="0 0 50px 0" gutterBottom>
        Еще никто не оставил комментария
      </Typography>
    );
  }
  return (
    <>
      {currentUser?.email?.length && reviews?.length > 0 && (
        <FormControlLabel
          sx={{
            display: "flex",
          }}
          control={<Switch onChange={handleChangeSortByDate} />}
          label="По дате"
        />
      )}
      <Wrapper>
        {reviews.map((r) => (
          <Review review={r} />
        ))}
      </Wrapper>
    </>
  );
};
