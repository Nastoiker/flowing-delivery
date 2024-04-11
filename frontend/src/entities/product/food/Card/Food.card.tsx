import { IFood } from "@/shared/interfaces/foods.interface";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";
import { useState } from "react";

export function FoodCard(props: { food: IFood }) {
  const { food } = props;
  const [imgIsLoaded, setImgIsLoaded] = useState(false);
  return (
    <Card sx={{ width: 300 }}>
      <CardActionArea>
        {imgIsLoaded ? (
          <CardMedia
            component="img"
            height="140"
            onLoad={() => setImgIsLoaded((p) => !p)}
            image={food.pictures}
            alt={food.title}
          />
        ) : (
          <Skeleton variant="rectangular" height={140} />
        )}

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {food.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {food.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Цена: ${food.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            В наличии: {food.in_stock}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Граммов: {food.grams}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Калорий: {food.calories}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Добавить в корзину
        </Button>
      </CardActions>
    </Card>
  );
}
