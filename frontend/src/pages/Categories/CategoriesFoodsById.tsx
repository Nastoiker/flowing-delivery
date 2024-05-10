import { FoodCard } from "@/entities/product/food/Card/Food.card";
import { useFoodsByCategory } from "@/shared/category/hooks/useCategories";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import styled from "styled-components";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;
const GridEL = styled.div`
  margin: 0 auto;
`;
export const CategoriesFoodsById = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useFoodsByCategory(Number(id));
  return (
    <div>
      <Typography margin={"50px"} variant="h4">
        {data?.data.category.name}
      </Typography>
      <Wrapper>
        {data?.data?.foods?.length > 0 ? (
          data?.data?.foods.map((f) => (
            <GridEL>
              <FoodCard key={f.id} food={f} />
            </GridEL>
          ))
        ) : (
          <Typography>Не найдено</Typography>
        )}
      </Wrapper>
    </div>
  );
};
