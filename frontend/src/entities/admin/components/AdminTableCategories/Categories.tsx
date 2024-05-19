import {
  updateCategory,
  useCategories,
} from "@/shared/category/hooks/useCategories";
import { Table } from "@radix-ui/themes";

export const AdminCategories = () => {
  const { data, isError, isLoading } = useCategories();
  const {} = updateCategory();
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
              <Table.Cell></Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
