import { useShoppingCartUser } from "@/entities/user/hooks/useCurrentUser";
import { useCreateShoppingCart } from "@/features/shopping-card/hooks/useCrudShoppingCard";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { IFood } from "@/shared/interfaces/foods.interface";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
export function FoodCard(props: { food: IFood }) {
  const { food } = props;
  const shoppingCartUser = useShoppingCartUser();
  const { createShoppingCart } = useCreateShoppingCart();
  const navigate = useNavigate();

  const handleRedirect = (url: string) => {
    navigate(url);
  };
  const handleAddToCart = async () => {
    await createShoppingCart({
      purchaseState: "",
      productId: food.id,
      totalPrice: food.price,
      count: 1,
    });
  };
  return (
    <Card sx={{ width: 300 }}>
      <CardActionArea
        onClick={() => {
          handleRedirect(`/menu/${food.id}`);
        }}
      >
        <AppImage
          fallback={<Skeleton variant="rectangular" height={140} />}
          src={`${HOST + food.pictures}`}
          alt={food.title}
          height="140px"
          width="100%"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {food.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {food.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Цена: {food.price}₽
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
        <Button
          disabled={food.count === 0}
          onClick={() => handleAddToCart()}
          size="small"
          color="primary"
        >
          {shoppingCartUser?.find((p) => p?.productId === food.id)
            ? "удалить"
            : "Добавить в корзину"}
        </Button>
      </CardActions>
    </Card>
  );
}
