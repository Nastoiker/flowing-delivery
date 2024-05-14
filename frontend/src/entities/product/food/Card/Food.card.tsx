import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import {
  useCreateShoppingCart,
  useDeleteShoppingCart,
  useShoppingCart,
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
import { Basket, Minus, Plus } from "@phosphor-icons/react";
import { isNumber } from "lodash";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
export function FoodCard(props: { food: IFood }) {
  const { food } = props;
  const { data: myCarts, isLoading: isLoadingCarts } = useShoppingCart();
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const { createShoppingCart, isLoading: isLoadingCreate } =
    useCreateShoppingCart();
  const isAdded = useMemo(
    () =>
      myCarts?.data?.shoppingCart?.find((p) => p?.productId === food.id)?.id,
    [myCarts, food]
  );
  const { deleteShoppingCart, isLoading: isLoadingDelete } =
    useDeleteShoppingCart();
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
    } else {
      await createShoppingCart({
        purchaseState: "",
        productId: food.id,
        totalPrice: food.price,
        count: 1,
      });
    }

    await dispatch(fetchCurrentUser);
  };
  return (
    <Card sx={{ width: 250, boxShadow: 1 }}>
      <CardActionArea
        onClick={() => {
          handleRedirect(`/menu/${food.id}`);
        }}
      >
        <AppImage
          fallback={<Skeleton variant="rectangular" height={140} />}
          errorFallback={<Skeleton variant="rectangular" height={140} />}
          src={`${HOST + food.pictures}`}
          alt={food.title}
          height="140px"
          width="100%"
        />
        <CardContent>
          <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>
            {food.price}₽
          </Typography>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            {food.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Энерг. ценность: {food.calories}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {food.grams} г
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
        {!isLoadingCarts && (
          <Button
            disabled={
              isLoadingDelete ||
              isLoadingCreate ||
              food.count === 0 ||
              !currentUser?.email
            }
            onClick={() => handleAddToCart()}
            size="medium"
            color="primary"
            variant="contained"
          >
            {isAdded ? (
              <>
                <Basket />
                <Minus size={13} />
              </>
            ) : (
              <>
                <Basket />
                <Plus size={13} />
              </>
            )}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
