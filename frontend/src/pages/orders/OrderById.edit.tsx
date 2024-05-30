import {
  useOrderById,
  useUpdateOrder,
} from "@/entities/orders/hooks/useCrudOrders";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import styled from "styled-components";
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 10px;
`;

const Header = styled.div`
  padding: 20px;
`;
const optionsStatuses = [
  { status: "created" },
  { status: "confirmed" },
  { status: "delivery" },
  { status: "received" },
];
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
export const getStatusLabel = (status) => {
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
export const OrderById = () => {
  const { id } = useParams();
  const { data: order } = useOrderById(Number(id));
  const { updateOrder } = useUpdateOrder(Number(id));

  if (!order) {
    return null;
  }

  return (
    <Wrapper>
      <Box display={"flex"} gap="50px" alignContent={"center"}>
        <Paper sx={{ width: "fit-content", margin: "20px 0" }} elevation={0}>
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
                  secondary={getStatusLabel(order.data.order.status)}
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
            <Content>
              <List>
                {order.data.order?.products?.map((product, index) => (
                  <div key={index}>
                    <Typography variant="body2">{product.title}</Typography>
                    <Typography variant="body2">
                      {product["OrderFood"]["quantity"]} шт. - {product.price}₽
                      за шт.
                    </Typography>
                    <AppImage
                      fallback={
                        <Skeleton
                          variant="rectangular"
                          width={140}
                          height={140}
                        />
                      }
                      src={`${HOST + product.pictures}`}
                      alt={product.title}
                      height="100px"
                      width="100px"
                    />
                  </div>
                ))}
              </List>
            </Content>
          </Content>
        </Paper>

        <Paper
          sx={{
            width: "fit-content",

            margin: "20px 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifyContent: "space-between",
            }}
            padding={"0 40px"}
          >
            <Box>
              <Header>
                <Typography variant="h5">Действия</Typography>
              </Header>
              <FormControl fullWidth>
                <InputLabel id="status-label">Статус</InputLabel>
                <Select
                  placeholder="Статус заказа"
                  labelId="status-label"
                  label="status"
                  value={order.data.order?.status}
                  sx={{ width: "100%" }}
                  onChange={(e) => {
                    updateOrder({ status: e.target.value.toString() });
                  }}
                >
                  {optionsStatuses.map((m, index) => (
                    <MenuItem key={index} value={m.status}>
                      {m.status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="outlined"
              onClick={() => {
                if (window.confirm("Вы уверены?")) {
                  updateOrder({ completed: true });
                }
              }}
            >
              Завершить
            </Button>
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ width: "fit-content" }}>
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
