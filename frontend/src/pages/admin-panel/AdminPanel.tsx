import { CreateCategory } from "@/entities/admin/components/CreateCategory";
import { CreateFood } from "@/entities/admin/components/CreateFood";
import styled from "styled-components";
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  align-items: center;
`;
export const AdminPanel = () => {
  const some = "";
  return (
    <Wrapper>
      <h1>Админ панель</h1>
      <h4>Создание категории</h4>

      <CreateCategory />
      <h4>Создание продукта</h4>
      <CreateFood />
    </Wrapper>
  );
};
