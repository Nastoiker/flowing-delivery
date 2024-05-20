import { FoodCard } from "@/entities/product/food/Card/Food.card";
import { Banners } from "@/features/banners/Banners";
import { FilterFoodDrawer } from "@/features/food/Filters/FilterFoodDrawer";
import { useFoods } from "@/shared/food/hooks/useCrudFood";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;
const GridEL = styled.div`
  margin: 0 auto;
`;
export const FoodPage = () => {
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  //@ts-ignore TODO
  const { data, isError } = useFoods({ filter, sort });

  const handleChangeSort = (field, directon) => {
    setSort((prev) => ({ ...prev, field, directon }));
  };
  const handleChangeFilter = (v) => {
    setFilter((prev) => ({ ...prev, ...v }));
  };
  if (isError || !data) {
    return null;
  }
  const filterValues = data.data?.foods.reduce(
    (acc, curr) => {
      // if (!isEmpty(filter)) {
      //   return acc;
      // } NOT WORK
      acc.minPrice = Math.min(acc.minPrice, curr.price);
      acc.maxPrice = Math.max(acc.maxPrice, curr.price);

      // Находим минимальное и максимальное количество калорий
      acc.minCalories = Math.min(acc.minCalories, curr.calories);
      acc.maxCalories = Math.max(acc.maxCalories, curr.calories);
      return acc;
    },
    {
      minCalories: 0,
      maxCalories: 0,
      minPrice: 0,
      maxPrice: 0,
    }
  );
  return (
    <>
      <Banners />
      <Box
        margin={"50px"}
        justifyContent={"space-between"}
        display={"flex"}
        alignItems={"center"}
      >
        <Typography variant="h4">Популярное</Typography>
        <FilterFoodDrawer
          minCalories={filterValues.minCalories}
          maxCalories={filterValues.maxCalories}
          minPrice={filterValues.minPrice}
          maxPrice={filterValues.maxPrice}
          onChangeFilter={handleChangeFilter}
          onChangeSort={handleChangeSort}
        />
      </Box>

      <Wrapper>
        {data?.data?.foods?.map((f) => (
          <GridEL key={f.id}>
            <FoodCard food={f} />
          </GridEL>
        ))}
      </Wrapper>
    </>
  );
};
