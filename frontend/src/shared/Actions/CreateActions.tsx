import { Button, Grid } from "@mui/material";

type Props = {
  isLoading: boolean;
  onCreateSubmit: () => void;
  onClose: () => void;
};
export const CreateAction = ({ isLoading, onCreateSubmit, onClose }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button disabled={isLoading} onClick={onCreateSubmit}>
          Создать
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button disabled={isLoading} onClick={onClose}>
          Отменить
        </Button>
      </Grid>
    </Grid>
  );
};
