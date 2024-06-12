import { HOST } from "@/helpers/api";
import {
  useCategories,
  useUpdateCategory,
} from "@/shared/category/hooks/useCategories";
import { AppImage } from "@/shared/components/image/AppImage";
import { Input, Skeleton } from "@mui/material";
import { Table } from "@radix-ui/themes";
import { format } from "date-fns";
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

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
            <Table.Cell>
              <Link to={`/categproes/${u.id}`}>{u.id}</Link>
            </Table.Cell>
            <Table.Cell>{u.name}</Table.Cell>
            <Table.Cell>{u?.slug}</Table.Cell>
            <Table.Cell>{u?.parentId}</Table.Cell>
            <Table.Cell>
              <AppImage
                fallback={
                  <Skeleton variant="rectangular" width={100} height={100} />
                }
                errorFallback={
                  <Skeleton variant="rectangular" height={100} width={100} />
                }
                src={`${HOST + u.pictures}`}
                alt={u.name}
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
