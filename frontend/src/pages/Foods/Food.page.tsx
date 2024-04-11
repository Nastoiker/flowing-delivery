import { FoodCard } from "@/entities/product/food/Card/Food.card";
import { useFoods } from "@/shared/food/hooks/useCrudFood";
import styled from "styled-components";

export const FoodPage = () => {
  const { data, isError } = useFoods();
  if (isError || !data) {
    return <div>Ошибка</div>;
  }
  const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
  `;
  return (
    <Wrapper>
      {data.data?.foods.map((f) => (
        <FoodCard key={f.id} food={f} />
      ))}
    </Wrapper>
  );
};
