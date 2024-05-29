import { Review } from "@/entities/review/components/Review";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { IReview } from "@/shared/interfaces/review.interface";
import { Skeleton } from "@mui/material";

export const UserReview = ({ review }: { review: IReview }) => {
  return (
    <div>
      <Review review={review} />
      <AppImage
        fallback={<Skeleton variant="rectangular" width={140} height={140} />}
        src={`${HOST + review?.product?.pictures}`}
        alt={review?.product?.title}
        height="100px"
        width="100px"
      />
    </div>
  );
};
