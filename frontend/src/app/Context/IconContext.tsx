import { IconContext } from "@phosphor-icons/react";
import type { ReactNode } from "react";

export const PhosphorProvider = ({ children }: { children: ReactNode }) => (
  <IconContext.Provider
    value={{
      size: 20,
      weight: "light",
      color: "currentColor",
      mirrored: false,
    }}
  >
    {children}
  </IconContext.Provider>
);
