import { getStatusLabel } from "@/pages/orders/OrderById.edit";
import { IOrder } from "@/shared/interfaces/order.interface";
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
  const redirect = useNavigate();
  const handleRedirect = (url: string) => {
    redirect(url);
  };
  return (
    <StyledCard>
      <CardContent
        onClick={() => {
          handleRedirect(`/orders/${order.id}`);
        }}
      >
        <Box
          sx={{
            marginBottom: "10px",
            borderBottomStyle: "dotted",
            borderBottomWidth: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" gutterBottom>
            №{order.id}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {order.totalPrice}₽
          </Typography>
        </Box>

        <Typography variant="body1">
          Статус: {getStatusLabel(order.status)}
        </Typography>
        <Typography variant="body1">
          Стоимость доставки: {order.deliveryPrice}₽
        </Typography>
        <Typography variant="body1">
          Стоимость еды: {order.priceFood}₽
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
              {order.products.map((product, index) => (
                <StyledListItem key={index}>
                  <Typography variant="body2">{product.title}</Typography>
                  <Typography variant="body2">
                    {product["OrderFood"]["quantity"]} шт. - {product.price}₽ за
                    шт.
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
