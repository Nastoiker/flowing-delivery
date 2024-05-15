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
    setFilter((prev) => ({ ...prev, v }));
  };
  if (isError || !data) {
    return null;
  }
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
          onChangeFilter={handleChangeFilter}
          onChangeSort={handleChangeSort}
        />
      </Box>

      <Wrapper>
        {data?.data?.foods?.map((f) => (
          <GridEL>
            <FoodCard key={f.id} food={f} />
          </GridEL>
        ))}
      </Wrapper>
    </>
  );
};
