import { Box } from "@mui/material";
import axios from "axios";
import { LatLng, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

const calculateDistance = (point1, point2) => {
  const latLng1 = new LatLng(point1.lat, point1.lng);
  const latLng2 = new LatLng(point2.lat, point2.lng);

  const distance = latLng1.distanceTo(latLng2);

  const distanceInKm = (distance / 1000).toFixed(2);
  return distanceInKm;
};

export const MapComponent = ({
  valueKm = 0,
  onChangeKm,
  coordinates,
  setCoordinates,
}) => {
  const zoom = 13;
  const [km, setKm] = useState<number>(valueKm);
  const [routePoints, setRoutePoints] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const center: LatLngExpression = [46.359844, 48.055491];
  useEffect(() => {
    async function fetch() {
      if (isLoading) {
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${coordinates[1]},${coordinates[0]};${center[1]},${center[0]}?steps=true&geometries=geojson`
        );
        const { data } = response;
        const points = data.routes[0].geometry.coordinates.map((arr) => [
          arr[1],
          arr[0],
        ]);
        setRoutePoints(points);
        setKm(
          Number(
            calculateDistance(
              { lng: coordinates[1], lat: coordinates[0] },
              { lng: center[1], lat: center[0] }
            )
          )
        );
        onChangeKm(
          Number(
            calculateDistance(
              { lng: center[1], lat: center[0] },
              { lng: coordinates[1], lat: coordinates[0] }
            )
          )
        );
      } catch (error) {
        console.error("Ошибка при получении маршрута:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [coordinates]);
  const handleMapClick = async (e) => {
    setCoordinates([e.latlng.lat, e.latlng.lng]);
    if (isLoading || !e.latlng) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${e.latlng.lng},${e.latlng.lat};${center[1]},${center[0]}?steps=true&geometries=geojson`
      );
      const { data } = response;
      const points = data.routes[0].geometry.coordinates.map((arr) => [
        arr[1],
        arr[0],
      ]);
      setRoutePoints(points);
      setKm(
        Number(calculateDistance(e.latlng, { lng: center[1], lat: center[0] }))
      );
      onChangeKm(
        Number(calculateDistance(e.latlng, { lng: center[1], lat: center[0] }))
      );
    } catch (error) {
      console.error("Ошибка при получении маршрута:", error);
    } finally {
      setIsLoading(false);
    }
  };
  function LocationMarker() {
    useMapEvents({
      click: handleMapClick,
    });

    return !coordinates?.length ? null : (
      <Marker position={{ lat: coordinates[0], lng: coordinates[1] }}>
        <Popup>Выбранная точка</Popup>
      </Marker>
    );
  }

  return (
    <Box height="500px" maxWidth="500px" width="100%">
      <MapContainer
        maxBounds={[
          [46.3, 48.0], // Юго-западная точка границы
          [46.4, 48.1], // Северо-восточная точка границы
        ]}
        maxZoom={18}
        style={{
          maxWidth: "500px",
          maxHeight: "500px",
          width: "100%",
          height: "100%",
          border: "10px solid #4C7C7D",
        }}
        center={center}
        zoom={zoom}
        minZoom={zoom}
      >
        <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <Marker position={center}>
          <Popup>Магазин</Popup>
        </Marker>
        <LocationMarker />
        {routePoints?.length > 0 && (
          <Polyline weight={5} positions={routePoints} color="#4C7C7D" />
        )}
      </MapContainer>
    </Box>
  );
};
