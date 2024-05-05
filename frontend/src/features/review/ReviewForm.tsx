import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Rating,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const REVIEW_MAX_LENGTH = 1000;
type Props = {
  onReviewSave: (review: NewReviewType) => void;
  loading: boolean;
};

export type NewReviewType = {
  title: string;
  description: string;
  rating: null | number;
};

export const ReviewForm = ({ onReviewSave, loading }: Props) => {
  const { control, handleSubmit } = useForm<NewReviewType>({
    defaultValues: {
      title: "",
      description: "",
      rating: null,
    },
    // стоит тут тк до v7 так было по дефолту, возможно не нужно
    shouldUnregister: true,
  });

  return (
    <Box mb={3} display="flex" flexDirection="column">
      <Grid container direction="column" spacing={2}>
        <Grid item xs={8}>
          <Controller
            name="title"
            control={control}
            rules={{ required: true, validate: (v) => Boolean(v?.length) }}
            render={({ field }) => (
              <TextField
                label="Отзыв кратко"
                fullWidth
                multiline
                inputProps={{ maxLength: 200 }}
                {...field}
              />
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
                multiline
                inputProps={{ maxLength: REVIEW_MAX_LENGTH }}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item>
          <Controller
            name="rating"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControlLabel
                labelPlacement="top"
                control={<Rating />}
                label="Оценка продукта"
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
            onClick={handleSubmit(onReviewSave)}
          >
            {loading ? "Сохранение..." : "Добавить"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
