import SearchIcon from "@/assets/icons/search.svg";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

export const SearchField = ({
  onChange: onSearchChange,
  debounce: wait = 500,
  onEnter,
  value = "",
  variant = "outlined",
  startAdornment = (
    <InputAdornment position="start">
      <img src={SearchIcon} alt="поиск" />
    </InputAdornment>
  ),
  ...props
}) => {
  const [valueLoaded, setIsValueLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const handleSearchChange = (e) => setSearch(e.target.value);

  const onChange = useCallback(debounce(onSearchChange, wait), [
    onSearchChange,
    wait,
  ]);

  useEffect(() => setSearch(value), [value]);

  useEffect(() => {
    if (!valueLoaded) {
      setIsValueLoaded(true);
      return;
    }

    if (search !== null) {
      onChange(search);
    }
  }, [search]);

  const { InputProps, ...restProps } = props;

  return (
    <TextField
      fullWidth
      variant={variant as TextFieldProps["variant"]}
      placeholder="Поиск"
      InputProps={{
        ...InputProps,
        startAdornment,
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter") {
          onEnter();
        }
      }}
      {...restProps}
      value={search || ""}
      onChange={handleSearchChange}
    />
  );
};
