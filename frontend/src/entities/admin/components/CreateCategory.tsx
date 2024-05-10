import { useCreateCategory } from "@/shared/category/hooks/useCategories";
import { Button, Input } from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import styled from "styled-components";

interface ICreateCategory {
  name: string;
  slug: string;
  pictures: Array<File>;
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
  const { register, handleSubmit, reset } = useForm<ICreateCategory>();
  const submit = async (category: ICreateCategory) => {
    try {
      const data = new FormData();
      for (let i = 0; i < category?.pictures.length; i++) {
        data.append("pictures", category.pictures[i]);
      }
      data.append("name", category.name?.toString());
      data.append("slug", category.slug?.toString());
      await createCategory(data);
      reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
    }
  };
  return (
    <Wrapper onSubmit={handleSubmit(submit)}>
      <Input placeholder="Имя категории" {...register("name")} />
      <Input placeholder="Уникальный индефикатор" {...register("slug")} />
      <Input
        required
        inputProps={{ accept: "image/jpeg" }}
        type="file"
        {...register("pictures")}
      />
      <Button type="submit">Создать</Button>
    </Wrapper>
  );
};
