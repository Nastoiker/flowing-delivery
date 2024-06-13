import { IFoodDto } from "@/entities/admin/components/CreateFood";
import { HOST } from "@/helpers/api";
import { RichTextFieldController } from "@/shared/components/RichTextField/RichTextFieldController";
import { SelectCategoryController } from "@/shared/components/Select/SelectCategory";
import { AppImage } from "@/shared/components/image/AppImage";
import {
  useDeleteFood,
  useFoodById,
  useUpdateFood,
} from "@/shared/food/hooks/useCrudFood";
import { Box, Button, Input, Skeleton } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
const Wrapper = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  max-width: 500px;
  width: 100%;
`;
export const FoodEditPage = () => {
  const { id } = useParams();
  const {
    data,
    isError: isErrorFood,
    isLoading: isLoadingFood,
  } = useFoodById(Number(id));
  const { deleteFood } = useDeleteFood(Number(id));
  const navigate = useNavigate();
  const { updateFood, error, isLoading } = useUpdateFood(Number(id));
  const methods = useForm<IFoodDto>({
    defaultValues: {
      title: data?.data?.food?.title,
      calories: data?.data?.food?.calories,
      description: data?.data?.food?.description,
      count: data?.data?.food?.count,
      in_stock: data?.data?.food?.in_stock,
      price: data?.data?.food?.price,
      grams: data?.data?.food?.grams,
      categoryId: data?.data?.food?.categoryId,
    },
  });
  const {
    handleSubmit,
    formState,
    setError,
    reset,
    control,
    register,
    setValue,
  } = methods;
  if (data?.data && !data?.data.food) {
    navigate("/menu");
  }
  const submit = async (food: IFoodDto) => {
    try {
      if (food.price < 0) {
        toast.error("Цена должна быть больше нуля");
        return;
      }
      const dataDto = new FormData();
      for (let i = 0; i < food?.pictures.length; i++) {
        dataDto.append("pictures", food.pictures[i]);
      }
      dataDto.append("title", food.title);
      dataDto.append("calories", food.calories?.toString());
      dataDto.append(
        "categoryId",
        food.categoryId?.toString() ?? data?.data?.food?.categoryId.toString()
      );

      dataDto.append("count", food.count?.toString());
      dataDto.append("description", food.description);
      dataDto.append("in_stock", food.in_stock?.toString());
      dataDto.append("price", food.price?.toString());
      dataDto.append("grams", food.grams?.toString());
      await updateFood(dataDto);
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
    }
  };
  if (!data) {
    return null;
  }

  return (
    <Box
      display={"flex"}
      flexWrap={"wrap"}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap="50px"
      margin="50px"
    >
      <Box maxWidth={"500px"}>
        <AppImage
          fallback={<Skeleton variant="rectangular" height={500} width={350} />}
          errorFallback={
            <Skeleton variant="rectangular" height={500} width={350} />
          }
          src={`${HOST + data?.data?.food?.pictures}`}
          alt={data?.data?.food?.title}
          height="100%"
          width="100%"
        />
      </Box>

      <FormProvider {...methods}>
        <Wrapper onSubmit={handleSubmit(submit)}>
          <label htmlFor="title">Название</label>
          <Input
            id="title"
            defaultValue={data?.data?.food?.title}
            placeholder="Название"
            required
            {...register("title")}
          />
          <label htmlFor="count">Количество</label>
          <Input
            defaultValue={data?.data?.food?.count}
            placeholder="Количество"
            type="number"
            required
            {...register("count")}
          />
          <RichTextFieldController
            defaultValue={data?.data?.food?.description}
          />
          <label htmlFor="in_stock">В наличие</label>
          <Input
            id="in_stock"
            defaultValue={data?.data?.food?.in_stock}
            placeholder="В наличие"
            type="number"
            required
            {...register("in_stock")}
          />
          <label htmlFor="grams">Грамм</label>
          <Input
            id={"grams"}
            defaultValue={data?.data?.food?.grams}
            placeholder="Грамов"
            type="number"
            required
            {...register("grams")}
          />
          <label htmlFor="calories">Калориев</label>
          <Input
            id="calories"
            defaultValue={data?.data?.food?.calories}
            placeholder="Энерг. ценность          "
            type="number"
            required
            {...register("calories")}
          />
          <label htmlFor="price">Цена</label>
          <Input
            id="price"
            defaultValue={data?.data?.food?.price}
            placeholder="Цена"
            type="number"
            required
            {...register("price")}
          />
          <SelectCategoryController
            defaultValue={data?.data?.food?.categoryId}
          />
          <label htmlFor="pictures">Фотка</label>
          <Input
            inputProps={{ accept: "image/jpeg" }}
            type="file"
            {...register("pictures")}
          />
          <Button type="submit">Редактировать</Button>
          <Button
            variant="contained"
            sx={{ background: "red" }}
            onClick={() => {
              if (window.confirm("Вы уверены?")) {
                deleteFood();
              }
            }}
          >
            Удалить
          </Button>
        </Wrapper>
      </FormProvider>
    </Box>
  );
};
