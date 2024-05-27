import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { Box, Button, Grid, Rating, TextField } from "@mui/material";
import { isEmpty } from "lodash";
import { Controller, useForm } from "react-hook-form";

const REVIEW_MAX_LENGTH = 1000;
type Props = {
  onReviewSave: (review: NewReviewType) => Promise<void>;
  loading: boolean;
  ratingUser: number;
};

export type NewReviewType = {
  title: string;
  description: string;
  rating: number;
};

export const ReviewForm = ({ onReviewSave, ratingUser, loading }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewReviewType>({
    defaultValues: {
      title: "",
      description: "",
    },
    // стоит тут тк до v7 так было по дефолту, возможно не нужно
    shouldUnregister: true,
  });
  const currentUser = useCurrentUser();
  if (!currentUser || !currentUser?.email?.length) {
    return null;
  }
  const submit = (review) => {
    onReviewSave(review);
    reset();
  };
  return (
    <Box
      mb={3}
      maxWidth={500}
      width={"100%"}
      display="flex"
      flexDirection="column"
    >
      <Grid container direction="column" spacing={2}>
        <Grid item xs={8} gap="20px" display={"flex"} alignItems={"center"}>
          <Controller
            name="title"
            control={control}
            rules={{ required: true, validate: (v) => Boolean(v?.length) }}
            render={({ field }) => (
              <TextField
                label="Коротко опишите"
                fullWidth
                multiline
                error={Boolean(errors.title)}
                inputProps={{ maxLength: 50 }}
                {...field}
              />
            )}
          />
          <Controller
            name="rating"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Rating {...field} readOnly={!isEmpty(ratingUser)} />
              // <FormControlLabel`
              //   labelPlacement="top"
              //   control={}
              //   label="Оценка продукта"
              //   {...field}
              // />
            )}
          />
        </Grid>

        <Grid item xs={8}>
          <Controller
            name="description"
            control={control}
            rules={{ required: true, validate: (v) => Boolean(v?.length) }}
            render={({ field }) => (
              <TextField
                label="Оставьте свой отзыв"
                fullWidth
                error={Boolean(errors.description)}
                multiline
                inputProps={{ maxLength: REVIEW_MAX_LENGTH }}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            onClick={handleSubmit(submit)}
          >
            {loading ? "Сохранение..." : "Добавить отзыв"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
