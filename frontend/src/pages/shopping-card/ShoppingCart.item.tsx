import {
  useDeleteShoppingCart,
  useUpdateShoppingCart,
} from "@/features/shopping-card/hooks/useCrudShoppingCard";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { IShoppingCart } from "@/shared/interfaces/shopping-cart.interface";
import { Box, IconButton, Skeleton } from "@mui/material";
import { Minus, Plus, Trash } from "@phosphor-icons/react";
import styled from "styled-components";

export const CartItem = styled.div`
  width: 82px;
  height: 82px;
  background-size: cover;
  filter: drop-shadow(0px 8px 25px rgba(224, 219, 196, 0.9));
  border-radius: 20px;
`;
const Actions = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  align-self: flex-start;
  flex-wrap: wrap;
`;
const ActionsButttons = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
`;
const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Name = styled.div`
  color: var(--text-color);
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const Price = styled.div`
  color: var(--primary-color);
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Number = styled.div`
  color: var(--text-color);
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
const Wrapper = styled.div`
  max-width: 700px;
  flex-direction: column;
  display: flex;
  gap: 50px;
  margin: 50px 0;
`;
export const ShoppintCartItem = ({
  shoppingCart,
}: {
  shoppingCart: IShoppingCart;
}) => {
  const { deleteShoppingCart } = useDeleteShoppingCart();
  const { updateShoppingCart, isUpdating } = useUpdateShoppingCart();
  const handleIncrement = async () => {
    await updateShoppingCart({
      ...shoppingCart,
      count: shoppingCart.count + 1,
    });
  };
  const handleDicrement = async () => {
    await updateShoppingCart({
      ...shoppingCart,
      count: shoppingCart.count - 1,
    });
  };
  return (
    <Wrapper>
      <Actions>
        <Box display={"flex"} alignItems={"center"} gap="40px">
          <AppImage
            fallback={
              <Skeleton variant="rectangular" width={140} height={140} />
            }
            src={`${HOST + shoppingCart.product.pictures}`}
            alt={shoppingCart.product.title}
            height="100px"
            width="100px"
          />
          <Description>
            <Name>{shoppingCart.product?.title}</Name>
            <Price>Цена: {shoppingCart.product?.price}₽</Price>
          </Description>
        </Box>

        <ActionsButttons>
          <IconButton disabled={isUpdating} onClick={() => handleDicrement()}>
            <Minus />
          </IconButton>
          <Number>{shoppingCart.count}</Number>

          <IconButton disabled={isUpdating} onClick={() => handleIncrement()}>
            <Plus />
          </IconButton>

          <IconButton onClick={() => deleteShoppingCart(shoppingCart.id)}>
            <Trash />
          </IconButton>
        </ActionsButttons>
      </Actions>
      <Price>Итогая сумма: {shoppingCart.totalPrice}₽</Price>
    </Wrapper>
  );
};
