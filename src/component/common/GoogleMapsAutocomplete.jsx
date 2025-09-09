/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

const GoogleMapsAutocomplete = ({
  title = "Location",
  onPlaceSelect,
  placeholder = "Enter location",
  error,
  type = ["geocode"],
  value,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const serviceRef = useRef(null);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || "");
    }
  }, [value]);

  useEffect(() => {
    if (!window.google) return;

    if (!serviceRef.current) {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  useEffect(() => {
    let active = true;

    if (!inputValue) {
      setOptions([]);
      return undefined;
    }

    if (!serviceRef.current) return undefined;

    setLoading(true);

    serviceRef.current.getPlacePredictions(
      { input: inputValue, types: type },
      (predictions, status) => {
        if (active) {
          setLoading(false);
          if (
            status !== window.google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            setOptions([]);
            return;
          }
          setOptions(predictions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [inputValue, type]);

  const fetchPlaceDetails = (placeId) => {
    if (!window.google) return;

    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    placesService.getDetails(
      {
        placeId,
        fields: ["name", "formatted_address", "geometry", "address_components"],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          if (onPlaceSelect) {
            const { formatted_address, name, address_components, geometry } =
              place;
            const lat = geometry?.location?.lat();
            const lng = geometry?.location?.lng();
            onPlaceSelect({
              name,
              formatted_address,
              address_components,
              location: {
                lat,
                lng,
              },
            });
          }
        }
      }
    );
  };

  return (
    <Autocomplete
      freeSolo
      inputValue={inputValue}
      filterOptions={(x) => x}
      options={options}
      getOptionLabel={(option) => option.description || ""}
      noOptionsText="No locations"
      loading={loading}
      popupIcon={null}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        if (newValue?.place_id) {
          fetchPlaceDetails(newValue.place_id);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          label={placeholder}
          required
          variant="outlined"
          error={error}
          helperText={
            error && (
              <Typography
                variant="body2"
                color="error"
                style={{
                  marginLeft: "-12px",
                  marginTop: "-5px",
                }}
              >
                {error}
              </Typography>
            )
          }
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          fullWidth
        />
      )}
    />
  );
};

export default GoogleMapsAutocomplete;
