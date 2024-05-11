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
  margin: 20px 0;
  gap: 10px;
`;
const WrapperMain = styled.div`
  display: flex;
  gap: 50px;
  align-items: center;
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
          <Typography margin={"50px 0"} variant="h4">
            {data?.data.food.title}
          </Typography>
          <AppImage
            fallback={
              <Skeleton variant="rectangular" height={800} width={300} />
            }
            errorFallback={
              <Skeleton variant="rectangular" height={500} width={500} />
            }
            src={`${HOST + data?.data.food.pictures}`}
            alt={data?.data.food.title}
            height="100%"
            width="500px"
          />
        </Box>

        <Wrapper>
          <div dangerouslySetInnerHTML={{ __html: santizeDesc }} />
          <Typography>{data?.data.food.price}р</Typography>
          <Typography>Энерг. ценность : {data?.data.food.calories}</Typography>
          <Typography>Вес: {data?.data.food.grams}</Typography>
        </Wrapper>
      </WrapperMain>
      <Box
        margin="50px 0"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <ReviewForm loading={isCreatingComment} onReviewSave={submitComment} />
        <RatingQuantity ratings={data?.data?.food?.ratings} />
      </Box>
      <ReviewWrapper reviews={reviews.data.reviews} />
    </div>
  );
};
