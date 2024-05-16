import { useCreateOrder } from "@/entities/orders/hooks/useCrudOrders";
import { MapComponent } from "@/features/delivery/Map";
import { PaymentForm } from "@/features/payment/PaymentForm";
import { useShoppingCart } from "@/features/shopping-card/hooks/useCrudShoppingCard";
import { Box, Button, Divider, Switch, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { ShoppintCartItem } from "./ShoppingCart.item";
const KMPrice = 40;
interface ICreateOrder {
  status: string;
  deliveryPrice: number;
  priceFood: number;
  totalPrice: number;
}
export const Wrapper = styled.div``;
export const ShoppingCardPage = () => {
  const { data: shoppingCarts, isError } = useShoppingCart();
  const { createOrderFetch, isLoading, error } = useCreateOrder();
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [isPickup, setIsPickUp] = useState(false);
  // const { register, handleSubmit, reset } = useForm<ICreateOrder>(); TODO
  //orderCreate: ICreateOrder
  const submit = async () => {
    try {
      await createOrderFetch({
        deliveryAddress: "",
        priceFood: sumPrice,
        deliveryPrice: deliveryPrice,
        status: "created",
        totalPrice: sumPrice + deliveryPrice,
      });
      toast.success("Успешное создание");
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
    }
  };
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
  const handelCheckPickUp = (e) => {
    setIsPickUp(e.target.checked);
    if (e.target.checked) {
      setDeliveryPrice(0);
    }
  };
  return (
    <Wrapper>
      <Typography margin="50px 0" variant="h3">
        Корзина
      </Typography>
      {shoppingCarts.data.shoppingCart?.length > 0 ? (
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
          <Box margin="20px 0 0 0" display="flex" alignItems="center">
            <Switch
              checked={isPickup}
              onChange={handelCheckPickUp}
              color="primary"
              inputProps={{ "aria-label": "primary checkbox" }}
              name="isPersonalManager"
            />
            <Typography>Самовывозом</Typography>
          </Box>
          {!isPickup && (
            <div>
              <Box margin="20px 0">
                <MapComponent valueKm={0} onChangeKm={onChangeKm} />
              </Box>
            </div>
          )}
          <Typography variant="h5" margin="50px 0">
            Доставка: {deliveryPrice}₽
          </Typography>
          <Divider />

          <Box margin="50px 0">
            <Typography variant="h5" margin="50px 0">
              Сумма: {sumPrice + deliveryPrice}₽
            </Typography>
          </Box>
          <Button
            onClick={() => submit()}
            variant="outlined"
            size="large"
            type="submit"
          >
            оформить
          </Button>
          <PaymentForm />
        </>
      ) : (
        <Typography margin="20px 0" variant="h5">
          В вашей корзине пока пусто
        </Typography>
      )}
    </Wrapper>
  );
};
