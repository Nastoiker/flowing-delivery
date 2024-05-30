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
import styled from "styled-components";
const optionsStatuses = [
  { status: "created" },
  { status: "confirmed" },
  { status: "delivery" },
  { status: "received" },
];
const StyledCard = styled(Card)`
  margin: 20px;
  width: 300px;
  border: 1px solid #ccc;
`;

const StyledListItem = styled(ListItem)`
  display: flex;
  padding: 0 !important;
  justify-content: space-between;
`;

export const UserOrderCard = ({ order }: { order: IOrder }) => {
  return (
    <StyledCard>
      <CardContent>
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

        {order.products && (
          <>
            <Divider />
            <Typography margin="10px 0 0 0" variant="h6">
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
