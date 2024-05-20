import { useUpdateUserById, useUsers } from "@/entities/user/hooks/useUsers";
import { Table } from "@radix-ui/themes";
import { UserActions } from "../../user/UserActions";

export const TableUsers = () => {
  const { data, isError } = useUsers();
  const { updateUserFetch, isLoading } = useUpdateUserById();
  if (isError || !data) {
    return null;
  }
  const handleUpdateUser = (id: number) => {
    updateUserFetch({ status: "banned", id });
  };
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
            <UserActions
              isLoading={isLoading}
              banUser={() => handleUpdateUser(u.id || 0)}
              isBanned={u.status === "banned"}
            />
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
