import { useOrders } from "@/entities/orders/hooks/useCrudOrders";
import { OrderCard } from "@/entities/orders/ui/OrderCard";
import styled from "styled-components";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;
const GridEL = styled.div`
  margin: 0 auto;
`;
export const OrdersPage = () => {
  const { data } = useOrders();
  return (
    <Wrapper>
      {data?.data?.orders?.map((o) => (
        <GridEL>
          <OrderCard key={o.id} order={o} />
        </GridEL>
      ))}
    </Wrapper>
  );
};
