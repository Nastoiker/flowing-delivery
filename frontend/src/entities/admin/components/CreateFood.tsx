import { SelectCategoryController } from "@/shared/components/Select/SelectCategory";
import { useCreateFood } from "@/shared/food/hooks/useCrudFood";
import { Button, Input } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import styled from "styled-components";
interface ICreateCategory {}
const Wrapper = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  max-width: 500px;
  width: 100%;
`;
export interface IFoodDto {
  categoryId: number;
  title: string;
  price: number;
  grams: number;
  calories: number;
  count: number;
  in_stock: number;
  description: string;
  pictures: Array<File>;
}

export const CreateFood = () => {
  const { createFood, error, isLoading } = useCreateFood();
  const methods = useForm<IFoodDto>();
  const {
    handleSubmit,
    formState,
    setError,
    reset,
    control,
    register,
    setValue,
  } = methods;

  const submit = async (food: IFoodDto) => {
    try {
      const data = new FormData();
      for (let i = 0; i < food?.pictures.length; i++) {
        data.append("pictures", food.pictures[i]);
      }
      data.append("title", food.title);
      data.append("calories", food.calories?.toString());
      data.append("categoryId", food.categoryId?.toString());
      data.append("count", food.count?.toString());
      data.append("description", food.description);
      data.append("in_stock", food.in_stock?.toString());
      data.append("price", food.price?.toString());
      data.append("grams", food.grams?.toString());
      await createFood(data);
      
      reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
    }
  };
  return (
    <FormProvider {...methods}>
      <Wrapper onSubmit={handleSubmit(submit)}>
        <Input placeholder="Название" required {...register("title")} />
        <Input
          placeholder="Количество"
          type="number"
          required
          {...register("count")}
        />
        <Input placeholder="Описание" required {...register("description")} />
        <Input
          placeholder="В наличие"
          type="number"
          required
          {...register("in_stock")}
        />
        <Input
          placeholder="Грамов"
          type="number"
          required
          {...register("grams")}
        />

        <Input
          placeholder="Энерг. ценность          "
          type="number"
          required
          {...register("calories")}
        />
        <SelectCategoryController />
        <Input
          placeholder="Цена"
          type="number"
          required
          {...register("price")}
        />
        <Input
          required
          inputProps={{ accept: "image/jpeg" }}
          type="file"
          {...register("pictures")}
        />
        <Button variant="outlined" type="submit">
          Создать
        </Button>
      </Wrapper>
    </FormProvider>
  );
};
