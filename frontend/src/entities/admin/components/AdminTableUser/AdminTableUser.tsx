import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { useUpdateUserById, useUsers } from "@/entities/user/hooks/useUsers";
import { SearchField } from "@/shared/search/SearchField";
import { Box } from "@mui/material";
import { Table } from "@radix-ui/themes";
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import { UserActions } from "../../user/UserActions";

export const TableUsers = () => {
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  //@ts-ignore
  const { data, isError } = useUsers({ filter, sort });
  const [search, setSearch] = useState();
  const currentUser = useCurrentUser();
  const { updateUserFetch, isLoading } = useUpdateUserById();
  const { ref, inView } = useInView();

  if (isError || !data || !data.pages || !data.pages.length) {
    return null;
  }

  const handleUpdateUser = (id: number, isBanned: boolean) => {
    updateUserFetch({ status: isBanned ? "new" : "banned", id });
  };
  const handleChangeSort = (field, direction) => {
    setSort((prev) => ({ ...prev, field, direction }));
  };
  const handleChangeFilter = (v) => {
    setFilter((prev) => ({ ...prev, ...v }));
  };
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
            {data?.pages?.map((p, index) => (
              <React.Fragment key={index}>
                {p?.data?.users[0] &&
                  Object.keys(p?.data?.users[0])?.map((k) => (
                    <Table.ColumnHeaderCell
                      key={k}
                      style={{ textAlign: "start" }}
                    >
                      {k}
                    </Table.ColumnHeaderCell>
                  ))}
              </React.Fragment>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data?.pages?.map((p, index) => (
            <React.Fragment key={index}>
              {p?.data?.users?.filter( f => f.id !== currentUser.id ).map((u) => (
                <Table.Row>
                  {Object.values(u)?.map((v) => (
                    <Table.Cell>{v}</Table.Cell>
                  ))}
                  <UserActions
                    isLoading={isLoading}
                    banUser={() => {
                      if (window.confirm("Вы уверены?")) {
                        handleUpdateUser(u?.id || 0, u?.status === "banned");
                      }
                    }}
                    isBanned={u?.status === "banned"}
                  />
                </Table.Row>
              ))}
            </React.Fragment>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
