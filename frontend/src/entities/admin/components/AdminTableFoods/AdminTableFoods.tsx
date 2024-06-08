import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { useFoods } from "@/shared/food/hooks/useCrudFood";
import { Box, Skeleton } from "@mui/material";
import { Table } from "@radix-ui/themes";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { SearchField } from "@/shared/search/SearchField";
import { useState } from "react";
import { FoodActions } from "../../food/FoodActions";
// export const TABLE_FOOD_ADMIN_CONFIGS = {
//   'pictures': (pictures) =>  <Table.Cell><AppImage
//   fallback={
//     <Skeleton
//       variant="rectangular"
//       width={100}
//       height={100}
//     />
//   }
//   errorFallback={
//     <Skeleton
//       variant="rectangular"
//       height={100}
//       width={100}
//     />
//   }
//   src={`${HOST + pictures}`}
//   alt={'product-img'}
//   height="100px"
//   width="100px"
// /></Table.Cell> ,
// [Symbol]: (v) => {
//   <Table.Cell>
//                     <Link to={`/admin/menu/${u.id}`}>{JSON.stringify(v)} </Link>

//   </Table.Cell>
// },
// }
export const TableFoods = () => {
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  //@ts-ignore TODO
  const { data, isError } = useFoods({ filter, sort });
  const currentUser = useCurrentUser();

  const [search, setSearch] = useState();
  const handleChangeSort = (field, direction) => {
    setSort((prev) => ({ ...prev, field, direction }));
  };
  const handleChangeFilter = (v) => {
    setFilter((prev) => ({ ...prev, ...v }));
  };
  if (isError || !data) {
    return null;
  }
  return (
    <Box>
      <SearchField
        onEnter={() => {}}
        value={search}
        size="small"
        onChange={(value) => {
          setSearch(value);
          handleChangeFilter({ search: value });
        }}
      />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {Object.keys(data.data.foods[0]).map((k) => (
              <Table.ColumnHeaderCell style={{ textAlign: "start" }}>
                {k}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.data.foods.map((u) => (
            <Table.Row>
              <Table.Cell>
                <Link to={`/admin/menu/${u.id}`}>{JSON.stringify(u.id)} </Link>
              </Table.Cell>
              <Table.Cell>{u.title}</Table.Cell>
              <Table.Cell>{u.price}</Table.Cell>
              <Table.Cell>{u.count}</Table.Cell>
              <Table.Cell>{u.calories}</Table.Cell>
              <Table.Cell>{u.grams}</Table.Cell>
              <Table.Cell>{u.in_stock}</Table.Cell>
              <Table.Cell>{u.description}</Table.Cell>
              <Table.Cell>
                <AppImage
                  fallback={
                    <Skeleton variant="rectangular" width={100} height={100} />
                  }
                  errorFallback={
                    <Skeleton variant="rectangular" height={100} width={100} />
                  }
                  src={`${HOST + u.pictures}`}
                  alt={u.title}
                  height="100px"
                  width="100px"
                />
              </Table.Cell>
              <Table.Cell>
                {/* @ts-ignore */}
                {format(u?.createdAt, "yyyy-MM-dd")}
              </Table.Cell>
              <Table.Cell>
                {/* @ts-ignore */}
                {format(u?.updatedAt, "yyyy-MM-dd")}
              </Table.Cell>
              <Table.Cell>{u?.category?.name}</Table.Cell>

              <Table.Cell>
                {u.ratings.length &&
                  u.ratings.reduce((acc, r) => acc + r.rating, 0) /
                    u.ratings.length}
              </Table.Cell>
              <Table.Cell>{u?.category?.name}</Table.Cell>
              <Table.Cell>{u?.commnets?.length}</Table.Cell>

              <FoodActions id={u.id} />
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
