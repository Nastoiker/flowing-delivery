import { IReview } from "@/shared/interfaces/review.interface";
import { Box, Paper, Rating, Typography } from "@mui/material";
import { Quotes } from "@phosphor-icons/react";

type Props = { review: IReview };

export const Review = ({ review }: Props) => {
  return (
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
          flexDirection: { sm: "row" },
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <Box display={"flex"} gap="20px">
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              {review?.user?.name}
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {review?.user?.surname}
            </Typography>
          </Box>
          <Quotes />
        </Box>

        <Rating value={review.rating} readOnly />
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "text.primary",
            marginBottom: 0.5,
          }}
        >
          {review.title}
        </Typography>
        <Typography
          sx={{ fontSize: "1rem", color: "text.secondary", lineHeight: 1.5 }}
        >
          {review.description}
        </Typography>
      </Box>
    </Paper>
  );
};
