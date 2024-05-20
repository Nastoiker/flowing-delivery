import {
  useCategories,
  useUpdateCategory,
} from "@/shared/category/hooks/useCategories";
import { Table } from "@radix-ui/themes";

export const AdminCategories = () => {
  const { data, isError, isLoading } = useCategories();
  const { updateCategoryFetch } = useUpdateCategory();

  if (isError || !data || isLoading) {
    return null;
  }
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {Object.keys(data.data.categories[0]).map((k) => (
            <Table.ColumnHeaderCell style={{ textAlign: "start" }}>
              {k}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.data.categories.map((u) => (
          <Table.Row>
            {Object.values(u).map((v) => (
              <Table.Cell>{v}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
