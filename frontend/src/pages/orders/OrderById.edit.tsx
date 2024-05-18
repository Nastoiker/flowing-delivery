import { useOrderById } from "@/entities/orders/hooks/useCrudOrders";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import styled from "styled-components";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Header = styled.div`
  padding: 20px;
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
`;

const WrapperMain = styled.div`
  display: flex;
  margin: 50px 0;
  gap: 50px;
  flex-wrap: wrap;
`;
export const OrderById = () => {
  const { id } = useParams();
  const { data: order } = useOrderById(Number(id));
  if (!order) {
    return null;
  }
  const getStatusLabel = (status) => {
    switch (status) {
      case "created":
        return "В ожидании";
      case "confirmed":
        return "Подтвержден";
      case "delivery":
        return "На доставке";
      case "received":
        return "Получен";
      default:
        return "Неизвестно";
    }
  };

  return (
    <Wrapper>
      <Paper sx={{ margin: "50px 0" }} elevation={0}>
        <Header>
          <Typography variant="h5">
            Детали заказа #{order.data.order.id}
          </Typography>
        </Header>
        <Divider />
        <Content>
          <List>
            <ListItem>
              <ListItemText
                primary="Дата создания"
                secondary={`${format(
                  //@ts-ignore
                  order.data.order.createdAt,
                  "dd/MM/yyyy HH:mm"
                )}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Статус:"
                secondary={`${order.data.order.totalPrice} руб.`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Адрес доставки:"
                secondary={order.data.order.deliveryAddress}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Сумма за товары:"
                secondary={`${order.data.order.priceFood} руб.`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Сумма за доставку:"
                secondary={
                  order.data.order.deliveryPrice
                    ? `${order.data.order.deliveryPrice} руб.`
                    : "Бесплатно"
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Сумма заказа:"
                secondary={`${order.data.order.totalPrice} руб.`}
              />
            </ListItem>
          </List>
        </Content>
      </Paper>
      <Paper>
        <Header>
          <Typography variant="h5">
            Информация о клиенте #{order.data.order.userId}
          </Typography>
        </Header>
        <Divider />
        <Content>
          <List>
            <ListItem>
              <ListItemText
                primary="ФИ клиента"
                secondary={`${order.data.order?.user?.name} ${order.data.order?.user?.surname}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Почта клиента"
                secondary={order.data.order?.user?.email}
              />
            </ListItem>
          </List>
        </Content>
      </Paper>
    </Wrapper>
  );
};
