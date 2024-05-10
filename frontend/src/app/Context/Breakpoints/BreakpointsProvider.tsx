import { throttle } from "lodash";
import { useEffect, useState } from "react";
import BreakpointsContext from "./BreakpointsContext";
import type { BreakpointsType } from "./types";

const getBreakpoints = (): BreakpointsType => ({
  matchesAndMore1920: document.documentElement.clientWidth >= 1920,
  matches1920: document.documentElement.clientWidth < 1920,
  matches1520: document.documentElement.clientWidth < 1520,
  matches1440: document.documentElement.clientWidth < 1440,
  matches1280: document.documentElement.clientWidth < 1280,
  matches960: document.documentElement.clientWidth < 960,
  matches760: document.documentElement.clientWidth < 760,
  matches640: document.documentElement.clientWidth < 640,
  matches480: document.documentElement.clientWidth < 480,
});

const BreakpointsProvider = ({ children }) => {
  const [breakpoints, setBreakpoints] = useState<BreakpointsType>(
    getBreakpoints()
  );

  useEffect(() => {
    const onResize = throttle(() => setBreakpoints(getBreakpoints()), 500);

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <BreakpointsContext.Provider value={breakpoints}>
      {children}
    </BreakpointsContext.Provider>
  );
};

export default BreakpointsProvider;
