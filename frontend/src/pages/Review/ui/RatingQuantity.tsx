import { declOfNum } from "@/helpers/declOfNum";
import { IRating } from "@/shared/interfaces/review.interface";
import { Box, Rating, Typography } from "@mui/material";
enum Ratings {
  four = 4,
  two = 2,
  one = 1,
  three = 3,
  five = 5,
}

export const RatingQuantity = ({ ratings }: { ratings: IRating[] }) => {
  const ratingCount = ratings.reduce(
    (acc, v) => {
      if (v.rating === 1) {
        acc.one++;
      } else if (v.rating === 2) {
        acc.two++;
      } else if (v.rating === 3) {
        acc.three++;
      } else if (v.rating === 4) {
        acc.four++;
      } else if (v.rating === 5) {
        acc.five++;
      }
      return acc;
    },
    {
      five: 0,
      four: 0,
      three: 0,
      two: 0,
      one: 0,
    }
  );
  return (
    <div>
      {Object.entries(ratingCount).map(([key, value]) => (
        <Box display="flex" alignItems="center" gap="10px">
          <Rating key={key} value={Ratings[key]} readOnly />
          <Typography>
            {value} {declOfNum(value, ["отзыв", "отзыва", "отзывов"])}
          </Typography>
        </Box>
      ))}
    </div>
  );
};
