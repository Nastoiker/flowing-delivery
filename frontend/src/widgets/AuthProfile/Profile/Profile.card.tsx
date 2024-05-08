import { useUpdateUsers } from "@/entities/user/hooks/useUsers";
import { IUser } from "@/shared/interfaces/user.interface";
import { Button, TextField, Typography } from "@mui/material";
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
      <h1>Ваши данные</h1>
      {isEdit ? (
        <Wrapper onSubmit={handleSubmit(submit)}>
          {Object.entries(listParamsToEdit).map(([key, value]) => (
            <TextField label={value} {...register(key as UserEditKeys)} />
          ))}
          <Button type="submit">Сохранить</Button>
        </Wrapper>
      ) : (
        <DataList.Root orientation={{ initial: "vertical", sm: "horizontal" }}>
          {Object.entries(listParams).map(([key, value]) => {
            return (
              <DataList.Item
                align="center"
                style={{ display: "flex" }}
                key={key}
              >
                <DataList.Label minWidth="288px">{value}:</DataList.Label>
                <DataList.Value>
                  <Typography>{user[key]}</Typography>
                </DataList.Value>
              </DataList.Item>
            );
          })}
          <Button onClick={() => setIsEdit((prev) => !prev)}>
            Редактировать
          </Button>
        </DataList.Root>
      )}
    </>
  );
};
