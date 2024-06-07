import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { useFoods } from "@/shared/food/hooks/useCrudFood";
import { Skeleton } from "@mui/material";
import { Table } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { FoodActions } from "../../food/FoodActions";
export const TABLE_FOOD_ADMIN_CONFIGS = {
  'pictures': (pictures) =>  <Table.Cell><AppImage
  fallback={
    <Skeleton
      variant="rectangular"
      width={100}
      height={100}
    />
  }
  errorFallback={
    <Skeleton
      variant="rectangular"
      height={100}
      width={100}
    />
  }
  src={`${HOST + pictures}`}
  alt={'product-img'}
  height="100px"
  width="100px"
/></Table.Cell> ,
[Symbol]: (v) => {
  <Table.Cell>
                    <Link to={`/admin/menu/${u.id}`}>{JSON.stringify(v)} </Link>

  </Table.Cell> 
},
}
export const TableFoods = () => {
  //@ts-ignore TODO
  const { data, isError } = useFoods({});
  if (isError || !data) {
    return null;
  }
  return (
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
            {Object.values(u).map((v) => (
              <Table.Cell>
                <Link to={`/admin/menu/${u.id}`}>{JSON.stringify(v)} </Link>
              </Table.Cell>
            ))}
            <FoodActions id={u.id} />
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
