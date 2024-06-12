import { AppBarScroll } from "@/app/Scrollbar/AppScrollbar";
import {
  Price,
  ShoppintCartItem,
} from "@/pages/shopping-card/ShoppingCart.item";
import { Button, Divider, Drawer, IconButton, Typography } from "@mui/material";
import { Basket, X } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useShoppingCart } from "../hooks/useCrudShoppingCard";
const Container = styled.div<{ $isShowPmBlock: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 50px;
  gap: 50px;
  transition: width 0.3s ease-in;
  height: 100%;
  padding-bottom: ${({ $isShowPmBlock }) => ($isShowPmBlock ? "172px" : "0px")};

  @media screen and (max-width: 640px) {
    width: 100%;
  }
`;
const StyledBasketDiv = styled.div`
  background: white;
  border-radius: 50px;
  width: 15px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  color: #4c7c7d;
  right: 2px;
  font-size: 10px;
`;
const Wrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  height: 100%;
`;
export const ShoppingCardSidebar = () => {
  const { data: shoppingCarts, isError } = useShoppingCart();
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const redirect = useNavigate();
  const sumPrice = shoppingCarts?.data.shoppingCart.reduce(
    (accumulator, value) => accumulator + value.totalPrice,
    0
  );
  const handleRedirectToShoppingCard = () => {
    setOpen(false);

    redirect("shopping-cart");
  };
  return (
    <>
      <IconButton sx={{ position: "relative" }} onClick={toggleDrawer(true)}>
        <Basket size={"30px"} />
        <StyledBasketDiv>
          {shoppingCarts?.data?.shoppingCart?.length}
        </StyledBasketDiv>
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <Container $isShowPmBlock={false}>
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <X />
          </IconButton>
          {shoppingCarts && shoppingCarts?.data?.shoppingCart?.length > 0 ? (
            <>
              <AppBarScroll
                style={{ height: "65vh", width: "300px", maxWidth: "280px" }}
              >
                <Wrapper>
                  {shoppingCarts?.data.shoppingCart?.map((s) => (
                    <ShoppintCartItem key={s.id} shoppingCart={s} />
                  ))}
                </Wrapper>
              </AppBarScroll>

              <Divider />
              <Price>Тотал: {sumPrice}₽</Price>
              <Button variant="outlined" onClick={handleRedirectToShoppingCard}>
                Перейти в корзину
              </Button>
            </>
          ) : (
            <Typography margin="20px 0" variant="h5">
              В вашей корзине пока пусто
            </Typography>
          )}
        </Container>
      </Drawer>
    </>
  );
};
