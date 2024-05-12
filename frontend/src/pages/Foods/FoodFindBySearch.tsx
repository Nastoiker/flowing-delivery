import { SearchContext } from "@/app/Context/SearchContext";
import { FoodCard } from "@/entities/product/food/Card/Food.card";
import { useSearchFood } from "@/shared/food/hooks/useCrudFood";
import { Typography } from "@mui/material";
import { useContext } from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;
const GridEL = styled.div`
  margin: 0 auto;
`;
export const FoodFindBySearch = () => {
  const { search } = useContext(SearchContext);
  const { data, isError } = useSearchFood(search);
  if (isError || !data) {
    return null;
  }
  return (
    <div>
      <Typography margin={"50px 0"} variant="h3">
        Результат поиска
      </Typography>
      <Wrapper>
        {data?.data?.foods?.length ? (
          data?.data?.foods?.map((f) => (
            <GridEL>
              <FoodCard key={f.id} food={f} />
            </GridEL>
          ))
        ) : (
          <Typography variant="h5" textAlign="center">
            К сожалению, ничего не найдено
          </Typography>
        )}
      </Wrapper>
    </div>
  );
};
