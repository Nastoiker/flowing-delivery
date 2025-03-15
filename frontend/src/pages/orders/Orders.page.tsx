import { useWindowSize } from "@/app/hooks/useWindowSize";
import { useOrders } from "@/entities/orders/hooks/useCrudOrders";
import { OrderCard } from "@/entities/orders/ui/OrderCard";
import { FilterOrderDrawer } from "@/features/orders/Filter/FilterOrder";
import { withGridWrapperCards } from "@/shared/containers/order/DekstopCard";
import { withVirtualizeCards } from "@/shared/containers/order/MobileCards";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const OrdersPage = () => {
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({ field: "id", direction: "asc" });
  //@ts-ignore
  const { data, fetchNextPage, isLoading, hasNextPage } = useOrders({
    filter,
    sort,
  });

  const { ref, inView } = useInView();
  const { matches960 } = useWindowSize();

  const allOrders = data?.pages.flatMap((p) => p.data.orders) ?? [];
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
  if (isLoading) {
    return <div>загрузка</div>;
  }
  const ContainersCard = matches960
    ? withVirtualizeCards(OrderCard)
    : withGridWrapperCards(OrderCard);
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
      <ContainersCard hasNextPage={Boolean(hasNextPage)} allRows={allOrders} />

      {hasNextPage && <div style={{ height: "20px" }} ref={ref}></div>}
    </>
  );
};
