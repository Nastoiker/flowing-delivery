import { Button, Grid } from "@mui/material";

type Props = {
  isLoading: boolean;
  banUser: () => void;
  isBanned: boolean;
};
export const UserActions = ({ isLoading, isBanned, banUser }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button variant="contained" disabled={isLoading} onClick={banUser}>
          {isBanned ? "Разбанить" : "Забанить"}
        </Button>
      </Grid>
    </Grid>
  );
};
