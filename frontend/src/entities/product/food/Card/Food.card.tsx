import {
  useCurrentUser,
  useShoppingCartUser,
} from "@/entities/user/hooks/useCurrentUser";
import {
  useCreateShoppingCart,
  useDeleteShoppingCart,
} from "@/features/shopping-card/hooks/useCrudShoppingCard";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { IFood } from "@/shared/interfaces/foods.interface";
import { useAppDispatch } from "@/shared/store/hooks";
import { fetchCurrentUser } from "@/shared/store/slices/currentUser";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Rating,
  Skeleton,
  Typography,
} from "@mui/material";
import { isNumber } from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
export function FoodCard(props: { food: IFood }) {
  const { food } = props;
  const shoppingCartUser = useShoppingCartUser();
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const { createShoppingCart } = useCreateShoppingCart();
  const [isAdded, setIsAdded] = useState<number | undefined | boolean>(
    shoppingCartUser?.find((p) => p?.productId === food.id)?.id
  );
  const { deleteShoppingCart } = useDeleteShoppingCart();
  const navigate = useNavigate();
  const ratingProduct = useMemo(
    () =>
      food.ratings.reduce((acc, r) => acc + r.rating, 0) /
        food.ratings.length || 0,
    [food]
  );
  const handleRedirect = (url: string) => {
    navigate(url);
  };
  const handleAddToCart = async () => {
    if (isNumber(isAdded)) {
      await deleteShoppingCart(isAdded);
      setIsAdded(false);
    } else {
      await createShoppingCart({
        purchaseState: "",
        productId: food.id,
        totalPrice: food.price,
        count: 1,
      });
      setIsAdded(true);
    }

    await dispatch(fetchCurrentUser);
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
          <Box display="flex" alignContent={"center"}>
            <Rating
              name="half-rating-read"
              defaultValue={ratingProduct}
              precision={0.5}
              readOnly
            />
            <Typography>{food.ratings.length}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          disabled={food.count === 0 || !currentUser.email}
          onClick={() => handleAddToCart()}
          size="small"
          color="primary"
        >
          {isAdded ? "Удалить" : "Добавить"}
        </Button>
      </CardActions>
    </Card>
  );
}
