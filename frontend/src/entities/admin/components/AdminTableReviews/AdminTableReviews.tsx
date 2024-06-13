import { useUpdateComment } from "@/entities/review/hooks/useCrudComment";
import { useAllReviews } from "@/entities/review/hooks/useReview";
import { SearchField } from "@/shared/search/SearchField";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import { UserReviewAdmin } from "../UserReviewAdminTable";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;
const GridEL = styled.div`
  margin: 0 auto;
  width: fit-content;
`;
const optionsStatuses = [
  { id: 1, status: 1, name: "Проверено" },
  { id: 2, status: 0, name: "Не проверено" },
];

export const AdminTableReviews = () => {
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({ field: "createdAt", direction: "desc" });
  const [search, setSearch] = useState();

  //@ts-ignore
  const { data, fetchNextPage } = useAllReviews({
    filter,
    sort,
  });
  const { updateCommentFood } = useUpdateComment();
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (!data || !data.pages || !data.pages.length) {
    return null;
  }

  const handleChangeSort = (field, direction) => {
    setSort((prev) => ({ ...prev, field, direction }));
  };
  const handleChangeFilter = (v) => {
    setFilter((prev) => ({ ...prev, ...v }));
  };
  return (
    <>
      <SearchField
        onEnter={() => {}}
        value={search}
        size="small"
        onChange={(value) => {
          setSearch(value);
          handleChangeFilter({ search: value });
        }}
      />
      <Wrapper>
        {data?.pages.map((p) => {
          return p?.data?.reviews?.map((o) => (
            <GridEL key={o.id}>
              <UserReviewAdmin review={o} />
              <FormControl fullWidth>
                <InputLabel id="review-label">Статус</InputLabel>

                <Select
                  placeholder="Статус отзыва"
                  value={o.status}
                  labelId="review-label"
                  label="review"
                  sx={{ width: "100%" }}
                  onChange={(e) => {
                    updateCommentFood({
                      id: o.id,
                      status: e.target.value.toString(),
                    });
                  }}
                >
                  {optionsStatuses.map((m, index) => (
                    <MenuItem key={index} value={m.status}>
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </GridEL>
          ));
        })}
        <div style={{ height: "20px" }} ref={ref}></div>
      </Wrapper>
    </>
  );
};
