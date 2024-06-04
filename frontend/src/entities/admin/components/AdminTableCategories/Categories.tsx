import {
  useCategories,
  useUpdateCategory,
} from "@/shared/category/hooks/useCategories";
import { Input } from "@mui/material";
import { Table } from "@radix-ui/themes";
import { ChangeEvent } from "react";

export const AdminCategories = () => {
  const { data, isError, isLoading } = useCategories();
  const { updateCategoryFetch } = useUpdateCategory();

  if (isError || !data || isLoading || !data.data) {
    return null;
  }
  const handleUpdatePicture = async (
    e: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const data = new FormData();
    if (e.target.files && e.target.files.length > 0) {
      data.append("pictures", e.target.files[0]);
      data.append("id", id.toString());

      await updateCategoryFetch(data);
    }
  };
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
            <Input
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleUpdatePicture(e, u.id as number)
              }
              type="file"
            />
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
