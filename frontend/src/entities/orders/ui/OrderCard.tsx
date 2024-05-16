import { IOrder } from "@/shared/interfaces/order.interface";
import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import styled from "styled-components";

const StyledCard = styled(Card)`
  margin: 20px;
  border: 1px solid #ccc;
`;

const StyledListItem = styled(ListItem)`
  display: flex;
  justify-content: space-between;
`;

export const OrderCard = ({ order }: { order: IOrder }) => {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Заказ №{order.id}
        </Typography>
        <Typography variant="body1">Статус: {order.status}</Typography>
        <Typography variant="body1">
          Стоимость доставки: {order.deliveryPrice}₽
        </Typography>
        <Typography variant="body1">
          Стоимость еды: {order.priceFood}₽
        </Typography>
        <Typography variant="body1" style={{ marginBottom: "16px" }}>
          Итого: {order.totalPrice}₽
        </Typography>
        {order.user && (
          <>
            <Divider />
            <Typography variant="h6" gutterBottom>
              Информация о клиенте
            </Typography>
            <Typography variant="body1">{order.user.name}</Typography>
            <Typography variant="body1">{order.user.name}</Typography>
          </>
        )}
        {order.products && (
          <>
            <Divider />
            <Typography variant="h6" gutterBottom>
              Продукты
            </Typography>
            <List>
              {order.products.map((product, index, arr) => (
                <StyledListItem key={index}>
                  <Typography variant="body2">{product.title}</Typography>
                  <Typography variant="body2">
                    {arr.length} шт. - {product.price}₽ за шт.
                  </Typography>
                </StyledListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </StyledCard>
  );
};
