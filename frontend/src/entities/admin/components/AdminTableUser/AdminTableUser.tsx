import { useUsers } from "@/entities/user/hooks/useUsers";
import { Table } from "@radix-ui/themes";

export const TableUsers = () => {
  const { data, isError, isLoading } = useUsers();
  if (isError || !data) {
    return <div>Ошибка</div>;
  }
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {Object.keys(data.data.users[0]).map((k) => (
            <Table.ColumnHeaderCell style={{ textAlign: "start" }}>
              {k}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.data.users.map((u) => (
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
