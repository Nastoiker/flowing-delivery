import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { IReview } from "@/shared/interfaces/review.interface";
import { Box, Paper, Rating, Skeleton, Typography } from "@mui/material";
import { Quotes } from "@phosphor-icons/react";
import { format } from "date-fns";
export const UserReviewAdmin = ({ review }: { review: IReview }) => {
  return (
    <div>
      <Paper
        sx={{
          margin: "20px auto",
          padding: { xs: 2, sm: 3 },
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            flexDirection: { sm: "row" },
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              {review?.user?.name}
            </Typography>

            <Typography sx={{ fontWeight: "bold" }}>
              {review?.user?.surname}
            </Typography>
          </Box>
          <Quotes />

          <Box display={"flex"} flexWrap={"wrap"} gap="20px">
            <Typography sx={{ fontWeight: "bold" }}>
              {format(review?.createdAt || "", "dd/MM/yyyy HH:mm")}
            </Typography>
          </Box>

          <Rating value={review.rating} readOnly />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "text.primary",
                marginBottom: 0.5,
                wordBreak: "break-all",
              }}
            >
              {review.title}
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: "text.secondary",
                lineHeight: 1.5,
                wordBreak: "break-all",
              }}
            >
              {review.description}
            </Typography>
          </Box>
          <Box>
            <AppImage
              fallback={
                <Skeleton variant="rectangular" width={100} height={100} />
              }
              errorFallback={
                <Skeleton variant="rectangular" width={100} height={100} />
              }
              src={`${HOST + review?.product?.pictures}`}
              alt={review?.product?.title}
              height="100px"
              width="100px"
            />
          </Box>
        </Box>
      </Paper>
    </div>
  );
};
