import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const AutoFitBound = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || bounds.length === 0) return;
    map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
};
