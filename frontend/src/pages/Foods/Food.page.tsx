import { FoodCard } from "@/entities/product/food/Card/Food.card";
import { useFoods } from "@/shared/food/hooks/useCrudFood";
import styled from "styled-components";

export const FoodPage = () => {
  const { data, isError } = useFoods();
  if (isError || !data) {
    return <div>Ошибка</div>;
  }
  const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(350px, 1fr) );
    gap: 30px;
  `;
  const GridEL = styled.div`
    margin: 0 auto;
  `;
  return (
    <Wrapper>
      {data?.data?.foods.map((f) => (
        <GridEL>
          <FoodCard key={f.id} food={f} />
        </GridEL>
      ))}
    </Wrapper>
  );
};
