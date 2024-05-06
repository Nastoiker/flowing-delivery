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
import { Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export const FoodById = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useFoodById(Number(id));
  const { createReview, isCreatingComment } = useCreateReview();
  const { data: reviews } = useReviewByFoodId(Number(id));
  if (isError || !data || !reviews) {
    return null;
  }
  const submitComment = async (
    review: Omit<IReview, "id" | "userId" | "foodId">
  ) => {
    await createReview({ foodId: Number(id), ...review });
  };
  return (
    <div>
      <h1>{data?.data.food.title}</h1>
      <AppImage
        fallback={<Skeleton variant="rectangular" height={800} width={300} />}
        src={`${HOST + data?.data.food.pictures}`}
        alt={data?.data.food.title}
        height="100%"
        width="500px"
      />
      <Typography paragraph>{data?.data.food.description}</Typography>
      <Typography>{data?.data.food.price}р</Typography>
      <Typography>Энерг. ценность : {data?.data.food.calories}</Typography>
      <Typography>Вес: {data?.data.food.grams}</Typography>
      <ReviewForm loading={isCreatingComment} onReviewSave={submitComment} />
      <ReviewWrapper reviews={reviews.data.reviews} />
    </div>
  );
};
