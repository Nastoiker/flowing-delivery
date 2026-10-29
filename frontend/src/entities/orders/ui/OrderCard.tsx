import { HOST } from "@/helpers/api";
import { getStatusLabel } from "@/pages/orders/OrderById.edit";
import { AppImage } from "@/shared/components/image/AppImage";
import { IOrder } from "@/shared/interfaces/order.interface";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useUpdateOrder } from "../hooks/useCrudOrders";
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

export const OrderCard = ({ order }: { order: IOrder }) => {
  const redirect = useNavigate();
  const { updateOrder } = useUpdateOrder(order.id);
  const handleRedirect = (url: string) => {
    redirect(url);
  };
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

        <Select
          placeholder="Статус заказа"
          value={order.status}
          sx={{ width: "100%" }}
          onChange={(e) => {
            updateOrder({ status: e.target.value.toString() });
          }}
        >
          {optionsStatuses.map((m, index) => (
            <MenuItem
              key={index}
              value={m.status}
              disabled={!(order.allowedStatuses ?? [order.status]).includes(m.status)}
            >
              {m.status}
            </MenuItem>
          ))}
        </Select>
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
            <Typography variant="h6">Продукты</Typography>
            <List>
              {order.products.map((product, index) => (
                <StyledListItem key={index}>
                  <Typography variant="body2">{product.title}</Typography>
                  <Typography variant="body2">
                    {product["OrderFood"]["quantity"]} шт. - {product.price}₽ за
                    шт.
                  </Typography>
                  <AppImage
                    fallback={
                      <Skeleton
                        variant="rectangular"
                        width={100}
                        height={100}
                      />
                    }
                    errorFallback={
                      <Skeleton
                        variant="rectangular"
                        height={100}
                        width={100}
                      />
                    }
                    src={`${HOST + product.pictures}`}
                    alt={product.title}
                    height="100px"
                    width="100px"
                  />
                </StyledListItem>
              ))}
            </List>
          </>
        )}

        <Button
          onClick={() => {
            handleRedirect(`/orders/${order.id}`);
          }}
          sx={{ width: "100%" }}
          variant="contained"
        >
          Перейти
        </Button>
      </CardContent>
    </StyledCard>
  );
};
