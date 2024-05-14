import { MapComponent } from "@/features/delivery/Map";
import { PaymentForm } from "@/features/payment/PaymentForm";
import { useShoppingCart } from "@/features/shopping-card/hooks/useCrudShoppingCard";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { ShoppintCartItem } from "./ShoppingCart.item";
const KMPrice = 40;
export const Wrapper = styled.div``;
export const ShoppingCardPage = () => {
  const { data: shoppingCarts, isError } = useShoppingCart();
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  if (isError || !shoppingCarts) {
    return null;
  }
  const onChangeKm = (kv: number) => {
    setDeliveryPrice(Math.round(kv * KMPrice));
  };
  const sumPrice = shoppingCarts.data.shoppingCart.reduce(
    (accumulator, value) => accumulator + value.totalPrice,
    0
  );
  return (
    <Wrapper>
      <Typography margin="50px 0" variant="h3">
        Корзина
      </Typography>
      {shoppingCarts.data.shoppingCart?.length > 0 ? 
      <>
      
        {shoppingCarts.data.shoppingCart?.map((s) => (
          <ShoppintCartItem key={s.id} shoppingCart={s} />
        ))}
       
      
      <Divider />
      <div>
        <Typography variant="h5" margin="50px 0">
          Итог: {sumPrice}₽
        </Typography>
      </div>
      <Divider />
      <Box margin="50px 0">
        <MapComponent valueKm={0} onChangeKm={onChangeKm} />
        <Typography variant="h5" margin="50px 0">
          Доставка: {deliveryPrice}₽
        </Typography>
      </Box>
      <Divider />
      <Box margin="50px 0">
        <Typography variant="h5" margin="50px 0">
          Сумма: {sumPrice + deliveryPrice}₽
        </Typography>
      </Box>
      <Button variant="outlined" size="large" type="submit">
        оформить
      </Button>
      <PaymentForm />
      </>
      :  <Typography margin="20px 0" variant="h5">
       В вашей корзине пока пусто
     </Typography>
}
    </Wrapper>
  );
};
