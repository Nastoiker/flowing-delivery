import { useDeleteFood } from "@/shared/food/hooks/useCrudFood";
import { Button, Grid } from "@mui/material";

type Props = {
  id: number;
};
export const FoodActions = ({ id }: Props) => {
  const { deleteFood, isLoading } = useDeleteFood(id);
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={() => {
            if (window.confirm("Вы уверены что хотите удалить?")) {
              deleteFood();
            }
          }}
        >
          Удалить
        </Button>
      </Grid>
    </Grid>
  );
};
