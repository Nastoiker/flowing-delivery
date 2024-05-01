import { useShoppingCart } from "@/features/shopping-card/hooks/useCrudShoppingCard";
import { Button, Divider, Typography } from "@mui/material";
import styled from "styled-components";
import { ShoppintCartItem } from "./ShoppingCart.item";

export const Wrapper = styled.div``;
export const ShoppingCardPage = () => {
  const { data: shoppingCarts, isError } = useShoppingCart();

  if (isError || !shoppingCarts) {
    return <div>Ошибка</div>;
  }
  const sumPrice = shoppingCarts.data.shoppingCart.reduce(
    (accumulator, value) => accumulator + value.totalPrice,
    0
  );
  return (
    <Wrapper>
      <h1>Корзина</h1>
      {shoppingCarts.data.shoppingCart?.length > 0 ? (
        shoppingCarts.data.shoppingCart?.map((s) => (
          <ShoppintCartItem key={s.id} shoppingCart={s} />
        ))
      ) : (
        <Typography variant="h4">В вашей корзине пока пусто</Typography>
      )}
      <Divider />
      <div>
        <h4>Итог: {sumPrice}₽</h4>
      </div>
      <Divider />
      <div>
        <h4>Доставка:</h4>
      </div>
      <Divider />
      <div>
        <h4>Сумма:</h4>
      </div>
      <Button type="submit">оформить</Button>
    </Wrapper>
  );
};
