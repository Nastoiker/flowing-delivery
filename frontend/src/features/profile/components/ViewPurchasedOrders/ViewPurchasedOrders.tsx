import { useMyPurchasedOrdersByUserId } from "@/entities/orders/hooks/useCrudOrders";
import { FoodCard } from "@/entities/product/food/Card/Food.card";
import styled from "styled-components";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;
const GridEL = styled.div`
  margin: 0 auto;
`;
export const ViewPurchasedOrders = () => {
  const { data, isError } = useMyPurchasedOrdersByUserId();
  if (isError || !data) {
    return null;
  }
  return (
    <Wrapper>
      {data?.data?.orders?.map((f) => (
        <GridEL key={f.id}>
          {f.products?.map((v) => (
            <FoodCard food={v} />
          ))}
        </GridEL>
      ))}
    </Wrapper>
  );
};
