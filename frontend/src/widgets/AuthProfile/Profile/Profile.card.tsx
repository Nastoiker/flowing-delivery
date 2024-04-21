import { IUser } from '@/shared/interfaces/user.interface';
import { Typography } from '@mui/material';
import { DataList } from '@radix-ui/themes';


export const UserDetails = ({ user }: { user: IUser }) => {
  const listParams =  {id: 'id',
    email: 'email',
    roles: 'Роль пользователя',
    name: 'Имя',
    surname: 'Фамилия',
    username: 'Логин',
    shoppingCart: 'Корзина товаров',
    orders: 'Покупки'};
  return (
    <>  
    <h1>Ваши данные</h1>
      <DataList.Root orientation={{ initial: 'vertical', sm: 'horizontal' }}>
        {Object.entries(listParams).map(([key, value]) => {
          return (
            <DataList.Item align="center" style={{display: 'flex'}} key={key}>
              <DataList.Label minWidth="288px">{value}</DataList.Label>
              <DataList.Value><Typography>{user[key]}</Typography></DataList.Value>
            </DataList.Item>
          );
        })}
      </DataList.Root>
    </>
  );
};