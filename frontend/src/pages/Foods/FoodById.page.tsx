import {
  useCreateReview,
  useReviewByFoodId,
} from "@/entities/review/hooks/useReview";
import { ReviewForm } from "@/features/review/ReviewForm";
import { ReviewWrapper } from "@/features/review/ReviewWrapper";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { useFoodById } from "@/shared/food/hooks/useCrudFood";
import { IReview } from "@/shared/interfaces/review.interface";
import { Box, Skeleton, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { RatingQuantity } from "../Review/ui/RatingQuantity";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const WrapperMain = styled.div`
  display: flex;
  margin: 50px 0;
  gap: 50px;
  flex-wrap: wrap;
`;
export const FoodById = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useFoodById(Number(id));
  const { createReview, isCreatingComment } = useCreateReview();
  const { data: reviews } = useReviewByFoodId(Number(id));
  if (isError || !data || !reviews) {
    return null;
  }
  const santizeDesc = DOMPurify.sanitize(data?.data.food.description);

  const submitComment = async (
    review: Omit<IReview, "id" | "userId" | "foodId">
  ) => {
    await createReview({ foodId: Number(id), ...review });
  };
  return (
    <div>
      <WrapperMain>
        <Box maxWidth={"500px"}>
          <AppImage
            fallback={
              <Skeleton variant="rectangular" height={500} width={330} />
            }
            errorFallback={
              <Skeleton variant="rectangular" height={500} width={330} />
            }
            src={`${HOST + data?.data.food.pictures}`}
            alt={data?.data.food.title}
            height="100%"
            width="100%"
          />
        </Box>

        <Wrapper>
          <Typography margin={"50px 0"} variant="h3">
            {data?.data.food.title}
          </Typography>
          <div
            style={{ fontSize: "20px" }}
            dangerouslySetInnerHTML={{ __html: santizeDesc }}
          />
          <Typography>{data?.data.food.price}р</Typography>
          <Typography>Энерг. ценность : {data?.data.food.calories}</Typography>
          <Typography>Вес: {data?.data.food.grams}</Typography>
        </Wrapper>
      </WrapperMain>
      <Box
        margin="50px 0"
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <ReviewForm loading={isCreatingComment} onReviewSave={submitComment} />
        <RatingQuantity ratings={data?.data?.food?.ratings} />
      </Box>
      <ReviewWrapper reviews={reviews.data.reviews} />
    </div>
  );
};
