import { createContext } from "react";

const BreakpointsContext = createContext({
  matchesAndMore1920: false,
  matches1920: false,
  matches1520: false,
  matches1440: false,
  matches1280: false,
  matches960: false,
  matches760: false,
  matches640: false,
  matches480: false,
});

export default BreakpointsContext;
