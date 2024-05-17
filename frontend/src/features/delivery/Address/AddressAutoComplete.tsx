import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export const DaDataAddressLookup = () => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const DADATA_API_KEY = "650ad1dcbe314ff7fdce95e130fa7d9d8c17b954";
  const DADATA_URL =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

  const fetchSuggestions = useCallback(async () => {
    if (address.trim() === "") {
      setSuggestions([]);
      return;
    }
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${DADATA_API_KEY}`,
      },
      body: JSON.stringify({
        query: address,
        locations: [{ city: "Астрахань" }],
        count: 10,
      }),
    };

    try {
      const response = await fetch(DADATA_URL, requestOptions);
      const data = await response.json();
      setSuggestions(
        data.suggestions.map((item) => ({
          label: item.value,
          lat: item.data.geo_lat,
          lon: item.data.geo_lon,
        }))
      );
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        fetchSuggestions();
      }, 500)
    );
  }, [address, fetchSuggestions]);

  const handleAddressChange = (event, value) => {
    setAddress(value?.label || "");
    setCoordinates(value ? { lat: value.lat, lon: value.lon } : null);
  };

  return (
    <Box>
      <Autocomplete
        id="address-input"
        options={suggestions}
        getOptionLabel={(option) => option.label}
        onChange={handleAddressChange}
        loading={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => {
              e.persist();
              setAddress(e.target.value);
            }}
            label="Enter your address"
          />
        )}
      />
      <Button variant="contained" disabled={!coordinates}>
        Lookup Coordinates
      </Button>
    </Box>
  );
};
