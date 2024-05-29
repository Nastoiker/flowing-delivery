import { useMyPurchasedOrdersByUserId } from "@/entities/orders/hooks/useCrudOrders";
import {
  useCreateReview,
  useReviewByFoodId,
} from "@/entities/review/hooks/useReview";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { ReviewForm } from "@/features/review/ReviewForm";
import { ReviewWrapper } from "@/features/review/ReviewWrapper";
import {
  useCreateShoppingCart,
  useDeleteShoppingCart,
  useShoppingCart,
  useUpdateShoppingCart,
} from "@/features/shopping-card/hooks/useCrudShoppingCard";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { useFoodById } from "@/shared/food/hooks/useCrudFood";
import { IReview } from "@/shared/interfaces/review.interface";
import { Box, Button, IconButton, Skeleton, Typography } from "@mui/material";
import { Basket, Minus, PencilLine, Plus, Trash } from "@phosphor-icons/react";
import DOMPurify from "dompurify";
import { isNumber } from "lodash";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { RatingQuantity } from "../Review/ui/RatingQuantity";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const WrapperMain = styled.div`
  display: flex;
  margin: 50px 0;
  gap: 50px;
  flex-wrap: wrap;
`;
const ActionsButttons = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
`;
export const FoodById = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useFoodById(Number(id));
  const { createReview, isCreatingComment } = useCreateReview();
  const { createShoppingCart, isLoading: isLoadingCreate } =
    useCreateShoppingCart();
  const currentUser = useCurrentUser();
  const redirect = useNavigate();
  const { data: myCarts, isLoading: isLoadingCarts } = useShoppingCart();
  const isAdded = useMemo(
    () =>
      myCarts?.data?.shoppingCart?.find(
        (p) => p?.productId === data?.data.food.id
      ),
    [myCarts, data]
  );
  const { deleteShoppingCart, isLoading: isLoadingDelete } =
    useDeleteShoppingCart();
  const { updateShoppingCart, isLoading: isUpdating } = useUpdateShoppingCart();
  const { data: purchasedOrders, isError: isErrorPurchasedOrders } =
    useMyPurchasedOrdersByUserId();
  const isBuyed =
    purchasedOrders &&
    purchasedOrders.data.orders.some((f) =>
      f?.products?.some((p) => p.id === Number(id))
    );
  const [sort, setSort] = useState({ field: "createdAt", direction: "asc" });
  const handleChangeSort = (field, direction) => {
    setSort((prev) => ({ ...prev, field, direction }));
  };
  const { data: reviews } = useReviewByFoodId({ foodId: Number(id), sort });
  if (isError || !data || !reviews) {
    return null;
  }
  const santizeDesc = DOMPurify.sanitize(data?.data.food.description);

  const submitComment = async (
    review: Omit<IReview, "id" | "userId" | "foodId">
  ) => {
    await createReview({ foodId: Number(id), ...review });
  };
  const handleAddToCart = async () => {
    if (isNumber(isAdded?.id)) {
      await deleteShoppingCart(isAdded?.id);
    } else {
      await createShoppingCart({
        purchaseState: "",
        productId: data.data.food.id,
        totalPrice: data.data.food.price,
        count: 1,
      });
    }
  };
  const handleIncrement = async () => {
    if (!isAdded) {
      return;
    }
    await updateShoppingCart({
      ...isAdded,
      count: isAdded?.count + 1,
    });
  };
  const handleDicrement = async () => {
    if (!isAdded) {
      return;
    }
    await updateShoppingCart({
      ...isAdded,
      count: isAdded.count - 1,
    });
  };
  return (
    <div>
      <WrapperMain>
        <Box maxWidth={"500px"}>
          <AppImage
            fallback={
              <Skeleton variant="rectangular" height={500} width={330} />
            }
            errorFallback={
              <Skeleton variant="rectangular" height={500} width={330} />
            }
            src={`${HOST + data?.data.food.pictures}`}
            alt={data?.data.food.title}
            height="100%"
            width="100%"
          />
        </Box>

        <Wrapper>
          <Typography margin={"50px 0"} variant="h3">
            {data?.data.food.title}
          </Typography>
          <div
            style={{ fontSize: "20px" }}
            dangerouslySetInnerHTML={{ __html: santizeDesc }}
          />
          <Typography>{data?.data.food.price}₽</Typography>
          <Typography>Энерг. ценность : {data?.data.food.calories}</Typography>
          <Typography>Вес: {data?.data.food.grams}</Typography>

          {!isLoadingCarts && (
            <>
              {isAdded && !isNaN(isAdded?.count) ? (
                <ActionsButttons>
                  <IconButton
                    disabled={isUpdating}
                    onClick={() => handleDicrement()}
                  >
                    <Minus />
                  </IconButton>
                  <div>{isAdded?.count ?? 0}</div>

                  <IconButton
                    disabled={isUpdating}
                    onClick={() => handleIncrement()}
                  >
                    <Plus />
                  </IconButton>

                  <IconButton onClick={() => deleteShoppingCart(isAdded?.id)}>
                    <Trash />
                  </IconButton>
                </ActionsButttons>
              ) : (
                <Button
                  disabled={
                    isLoadingDelete ||
                    isLoadingCreate ||
                    data.data.food.count === 0 ||
                    !currentUser?.email
                  }
                  sx={{ width: "70px" }}
                  onClick={() => handleAddToCart()}
                  size="medium"
                  color="primary"
                  variant="contained"
                >
                  <>
                    <Basket />
                    <Plus size={13} />
                  </>
                </Button>
              )}
            </>
          )}
          {currentUser.roles && currentUser.roles === 1 && (
            <Button
              variant="contained"
              sx={{ width: "50px" }}
              onClick={() => redirect(`/admin/menu/${data.data.food.id}`)}
            >
              <PencilLine />
            </Button>
          )}
        </Wrapper>
      </WrapperMain>

      <Box
        margin="50px 0"
        display="flex"
        alignItems="start"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {isBuyed ? (
          <ReviewForm
            ratingUser={
              data?.data?.food?.ratings.find((r) => r.userId === currentUser.id)
                ?.rating
            }
            loading={isCreatingComment}
            onReviewSave={submitComment}
          />
        ) : (
          <Typography variant="h5">
            Купите товар, чтобы оставить отзыв
          </Typography>
        )}

        <RatingQuantity ratings={data?.data?.food?.ratings} />
      </Box>

      <ReviewWrapper
        onChangeSort={handleChangeSort}
        reviews={reviews.data.reviews}
      />
    </div>
  );
};
