import { Review } from "@/entities/review/components/Review";
import { IReview } from "@/shared/interfaces/review.interface";
import styled from "styled-components";

const Wrapper = styled.div``;
type Props = { reviews: IReview[] };
export const ReviewWrapper = ({ reviews }: Props) => {
  return (
    <Wrapper>
      {reviews.map((r) => (
        <Review review={r} />
      ))}
    </Wrapper>
  );
};
