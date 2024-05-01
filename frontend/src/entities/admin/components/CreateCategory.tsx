import { useCreateCategory } from "@/shared/category/hooks/useCategories";
import { Button, Input } from "@mui/material";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import styled from "styled-components";

interface ICreateCategory {
  name: string;
  slug: string;
}
const Wrapper = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  max-width: 500px;
  width: 100%;
`;
export const CreateCategory = () => {
  const { createCategory, error, isLoading } = useCreateCategory();
  const { register, handleSubmit } = useForm<ICreateCategory>();
  const submit = async (category: ICreateCategory) => {
    try {
      await createCategory(category);
    } catch (e: any) {
      toast.error(e?.response?.data?.message)

    }
  };
  return (
    <Wrapper onSubmit={handleSubmit(submit)}>
      <Input placeholder="Имя категории" {...register("name")} />
      <Input placeholder="Уникальный индефикатор" {...register("slug")} />
      <Button type="submit">Создать</Button>
    </Wrapper>
  );
};
