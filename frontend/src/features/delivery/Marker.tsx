import { LatLngExpression } from "leaflet";
import { Marker as MarkerMain, Popup } from "react-leaflet";

export const Marker = ({
  position,
  text,
}: {
  position: LatLngExpression;
  text: string;
}) => {
  if (!position) return null;

  return (
    <MarkerMain position={position}>
      <Popup>{text}</Popup>
    </MarkerMain>
  );
};
