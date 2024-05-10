import { useEffect, useState } from "react";

export const useScrollY = () => {
  const isBrowser = typeof window !== "undefined";
  const [stateScroll, setStateScroll] = useState<number>(0);

  const handleScroll = () => {
    const currrentScrollY = isBrowser ? window.scrollY : 0;
    setStateScroll(currrentScrollY);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return stateScroll;
};
