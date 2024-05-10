import { useContext } from "react";
import BreakpointsContext from "../Context/Breakpoints/BreakpointsContext";
import { BreakpointsType } from "../Context/Breakpoints/types";

type WindowSizeType = BreakpointsType & {
  width: number;
  height: number;
};

/**
 * Хук для отслеживания изменения размера экрана
 * @returns объект с высотой, шириной экрана и boolean значением мобильное/десктоп разрешение
 */
export const useWindowSize = (): WindowSizeType => {
  const breakpoints = useContext(BreakpointsContext);

  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    ...breakpoints,
  };
};
