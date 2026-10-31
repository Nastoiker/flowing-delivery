import { useCreateOrder } from "@/entities/orders/hooks/useCrudOrders";
import DaDataAddressLookup from "@/features/delivery/Address/AddressAutoComplete";
import { MapComponent } from "@/features/delivery/Map";
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
  const [address, setAddress] = useState();
  const [coordinates, setCoordinates] = useState();

  // const { register, handleSubmit, reset } = useForm<ICreateOrder>(); TODO
  //orderCreate: ICreateOrder
  const submit = async () => {
    if (isLoading) return;
    try {
      if (!address && !isPickup) {
        toast.error("Выберите адрес");
        return;
      }
      await createOrderFetch({
        deliveryAddress: address,
        priceFood: sumPrice,
        deliveryPrice: deliveryPrice,
        status: "created",
        isPickUp: isPickup,
        totalPrice: sumPrice + deliveryPrice,
      });
      toast.success("Успешное создание");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Не удалось оформить заказ. Попробуйте ещё раз.");
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
                <MapComponent
                  setCoordinates={setCoordinates}
                  coordinates={coordinates}
                  valueKm={0}
                  onChangeKm={onChangeKm}
                />
              </Box>
              <DaDataAddressLookup
                setCoordinates={setCoordinates}
                coordinates={coordinates}
                onChangeAddress={(address) => setAddress(address)}
              />
            </div>
          )}
          <Typography variant="h5" margin="25px 0">
            Доставка: {deliveryPrice}₽
          </Typography>
          <Divider />
          <Typography variant="h5" margin="25px 0">
            {address}
          </Typography>
          <Box
            display={"flex"}
            margin="25px 0 50px 0"
            flexWrap={"wrap"}
            gap="20px"
            alignItems={"center"}
          >
            <Box>
              <Typography variant="h5">
                Сумма: {sumPrice + deliveryPrice}₽
              </Typography>
            </Box>
            <Button
              disabled={isLoading}
              onClick={() => submit()}
              variant="outlined"
              size="large"
              sx={{ margin: "10px 0" }}
              type="submit"
            >
              <Typography variant="h5">оформить</Typography>
            </Button>
          </Box>

          {/* TODO */}
          {/* <PaymentForm totalPrice={sumPrice + deliveryPrice} /> */}
        </>
      ) : (
        <Typography margin="20px 0" variant="h5">
          В вашей корзине пока пусто
        </Typography>
      )}
    </Wrapper>
  );
};
