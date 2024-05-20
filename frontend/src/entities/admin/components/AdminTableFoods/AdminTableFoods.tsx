import { useFoods } from "@/shared/food/hooks/useCrudFood";
import { Table } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { FoodActions } from "../../food/FoodActions";

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
