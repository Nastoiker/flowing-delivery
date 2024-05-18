import { useOrders } from "@/entities/orders/hooks/useCrudOrders";
import { OrderCard } from "@/entities/orders/ui/OrderCard";
import { FilterOrderDrawer } from "@/features/orders/Filter/FilterOrder";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
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
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  //@ts-ignore
  const { data, fetchNextPage } = useOrders({
    filter,
    sort,
  });
  const { ref, inView } = useInView();
  const handleChangeSort = (field, directon) => {
    setSort((prev) => ({ ...prev, field, directon }));
  };
  const handleChangeFilter = (v) => {
    setFilter((prev) => ({ ...prev, ...v }));
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  return (
    <>
      <Box
        display="flex"
        margin="50px"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h4">Заказы</Typography>
        <FilterOrderDrawer
          onChangeFilter={handleChangeFilter}
          onChangeSort={handleChangeSort}
        />
      </Box>
      <Wrapper>
        {data?.pages.map((p) => {
          return p?.data?.orders?.map((o) => (
            <GridEL key={o.id}>
              <OrderCard order={o} />
            </GridEL>
          ));
        })}
        <div ref={ref}>
          :D
        </div>
      </Wrapper>
    </>
  );
};
