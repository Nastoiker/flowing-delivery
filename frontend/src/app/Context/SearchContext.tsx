import { createContext, useState } from "react";

type CommonSearchContextApiType = {
  search: string;
  setSearch: (value: string) => void;
};
export const SearchContext = createContext<CommonSearchContextApiType>(
  {} as CommonSearchContextApiType
);

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
