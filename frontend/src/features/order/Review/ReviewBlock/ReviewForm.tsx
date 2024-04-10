import { Box, Grid, TextField } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import REVIEW_MAX_LENGTH from 'constants/review';
import { Controller, useForm } from 'react-hook-form';
import { CustomCircularProgress, CustomFormControlLabel, SaveButton } from './ui';

type Props = {
  onReviewSave: (review: NewReviewType) => void;
  loading: boolean;
};

export type NewReviewType = {
  comment: string;
  rate: number;
};

export const ReviewForm = ({ onReviewSave, loading }: Props) => {
  const { control, handleSubmit } = useForm<NewReviewType>({
    defaultValues: {
      comment: '',
      rate: null,
    },
    // стоит тут тк до v7 так было по дефолту, возможно не нужно
    shouldUnregister: true,
  });

  return (
    <Box mb={3} display="flex" flexDirection="column">
      <Grid container direction="column" spacing={2}>
        <Grid item xs={8}>
          <Controller
            name="comment"
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
            name="rate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomFormControlLabel
                labelPlacement="top"
                control={<Rating />}
                label="Оценка продукта"
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item>
          <SaveButton
            variant="contained"
            type="submit"
            disabled={loading}
            onClick={handleSubmit(onReviewSave)}
          >
            {loading ? 'Сохранение...' : 'Добавить'}
            {loading && <CustomCircularProgress size={22} />}
          </SaveButton>
        </Grid>
      </Grid>
    </Box>
  );
};
