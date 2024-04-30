import {
  useDeleteShoppingCart,
  useUpdateShoppingCart,
} from "@/features/shopping-card/hooks/useCrudShoppingCard";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { IShoppingCart } from "@/shared/interfaces/shopping-cart.interface";
import { Button, Skeleton } from "@mui/material";
import styled from "styled-components";

export const CartItem = styled.div`
  width: 82px;
  height: 82px;
  background-size: cover;
  filter: drop-shadow(0px 8px 25px rgba(224, 219, 196, 0.9));
  border-radius: 20px;
`;
const Actions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 40px;
  align-items: center;
  align-self: flex-start;
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

const Price = styled.div`
  color: var(--primary-color);
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Minus = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--primary-color);
  border-radius: 50%;
  width: 29px;
  height: 29px;
  cursor: pointer;
`;

const Plus = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 50%;
  width: 29px;
  cursor: pointer;
  height: 29px;
`;

const Remove = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: 29px;
  height: 29px;
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
`;
export const ShoppintCartItem = ({
  shoppingCart,
}: {
  shoppingCart: IShoppingCart;
}) => {
  const { deleteShoppingCart } = useDeleteShoppingCart();
  const { updateShoppingCart } = useUpdateShoppingCart();
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
        <AppImage
          fallback={<Skeleton variant="rectangular" height={140} />}
          src={`${HOST + shoppingCart.product.pictures}`}
          alt={shoppingCart.product.title}
          height="100px"
          width="100px"
        />
        <Description>
          <Name>{shoppingCart.product?.title}</Name>
          <Price>Цена: {shoppingCart.product?.price}р</Price>
        </Description>
        <Actions>
          <Plus onClick={() => handleIncrement()}>+</Plus>
          <Number>{shoppingCart.count}</Number>

          <Minus onClick={() => handleDicrement()}>-</Minus>
          <Remove onClick={() => deleteShoppingCart(shoppingCart.id)}>
            Удалить все
          </Remove>
        </Actions>
      </Actions>
    </Wrapper>
  );
};
