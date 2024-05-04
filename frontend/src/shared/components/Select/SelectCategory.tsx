import { useCategories } from "@/shared/category/hooks/useCategories";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export const SelectCategoryController = () => {
  const { data, isError } = useCategories();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  if (isError || !data) {
    return null;
  }

  return (
    <>
      <Controller
        name="categoryId"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <FormControl fullWidth>
            <InputLabel id="categories-label">Категории</InputLabel>
            <Select
              onChange={onChange}
              value={value}
              labelId="categories-label"
              label="categories"
              inputRef={ref}
            >
              {data.data.categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </>
  );
};
