import { useUpdateUsers } from "@/entities/user/hooks/useUsers";
import { ViewOrders } from "@/features/profile/components/ViewOrders/ViewOrders";
import { ViewPurchasedOrders } from "@/features/profile/components/ViewPurchasedOrders/ViewPurchasedOrders";
import { IUser } from "@/shared/interfaces/user.interface";
import { Box, Button, Tab, TextField, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import { DataList } from "@radix-ui/themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
const listParams = {
  // id: "id",
  email: "email",
  roles: "Роль пользователя",
  name: "Имя",
  surname: "Фамилия",
  username: "Логин",
  // shoppingCart: "Корзина товаров",
  // orders: "Покупки",
};
const listParamsToEdit = {
  name: "Имя",
  surname: "Фамилия",
  username: "Логин",
};
const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: fit-content;
`;
type UserEditKeys = "name" | "surname" | "username";
export const UserDetails = ({ user }: { user: IUser }) => {
  const [valueTab, setValueTab] = useState(0);
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { updateMe } = useUpdateUsers();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      surname: user.surname,
      username: user.username,
      name: user.name,
    },
  });
  const submit = async (data: Partial<IUser>) => {
    try {
      await updateMe(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsEdit((prev) => !prev);
    }
  };
  return (
    <>
      <Typography margin={"50px 0"} variant="h4">
        Профиль
      </Typography>
      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={valueTab}
        onChange={handleChangeTab}
        aria-label="basic tabs example"
      >
        <Tab label="Данные" {...a11yProps(0)} />
        <Tab label="Ваши заказы" {...a11yProps(1)} />
        <Tab label="Ваши отзывы" {...a11yProps(2)} />
        <Tab label="Ваши купленные товары" {...a11yProps(3)} />
      </Tabs>
      <CustomTabPanel value={valueTab} index={0}>
        {isEdit ? (
          <Wrapper onSubmit={handleSubmit(submit)}>
            {Object.entries(listParamsToEdit).map(([key, value]) => (
              <TextField label={value} {...register(key as UserEditKeys)} />
            ))}
            <Button type="submit" variant="outlined">
              Сохранить
            </Button>
          </Wrapper>
        ) : (
          <Box>
            <DataList.Root
              orientation={{ initial: "vertical", sm: "horizontal" }}
            >
              {Object.entries(listParams).map(([key, value]) => {
                return (
                  <DataList.Item
                    align="center"
                    style={{ display: "flex" }}
                    key={key}
                  >
                    <DataList.Label minWidth="288px">{value}:</DataList.Label>
                    <DataList.Value>
                      <Typography color="primary">{user[key]}</Typography>
                    </DataList.Value>
                  </DataList.Item>
                );
              })}
            </DataList.Root>
            <Button
              variant="contained"
              onClick={() => setIsEdit((prev) => !prev)}
            >
              Редактировать
            </Button>
          </Box>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={valueTab} index={1}>
        <ViewOrders />
      </CustomTabPanel>
      <CustomTabPanel value={valueTab} index={3}>
        <ViewPurchasedOrders />
      </CustomTabPanel>
    </>
  );
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
