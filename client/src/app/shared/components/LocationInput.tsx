import { useEffect, useMemo, useState } from 'react';
import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from 'react-hook-form';
import type { LocationIQSuggestion } from '../../../lib/types';
import {
  Box,
  debounce,
  List,
  ListItemButton,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';

// Define the Props type for this component
type Props<T extends FieldValues> = {
  label: string; // Require a label prop (used by MUI TextField)
} &
  // Include all props needed by react-hook-form's controller (name, control, rules, etc.)
  UseControllerProps<T>;

export default function LocationInput<T extends FieldValues>(props: Props<T>) {
  const { field, fieldState } = useController({ ...props });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
  const [inputValue, setInputValue] = useState(field.value || '');

  useEffect(() => {
    if (field.value && typeof field.value === 'object') {
      setInputValue(field.value.venue || '');
    } else {
      setInputValue(field.value || '');
    }
  }, [field.value]);

  const locationUrl = `https://api.locationiq.com/v1/autocomplete?key=pk.c368e717f464219bb71a1d75eaf490a7&limit=5&dedupe=1&`;

  const fetchSuggestions = useMemo(
    () =>
      debounce(async (query: string) => {
        // If the query is empty or less then 3 characters, clear the suggestions and return
        if (!query || query.length < 3) {
          setSuggestions([]);
          return;
        }

        // User has entered an approved string to search for
        setLoading(true);

        try {
          // Create the URL for the API endpoint and make the request using Axios
          const response = await axios.get<LocationIQSuggestion[]>(
            `${locationUrl}q=${query}`,
          );

          // Set the Suggestions returned from the API response
          setSuggestions(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }, 500),
    [locationUrl],
  );

  const handleChange = async (value: string) => {
    field.onChange(value);
    await fetchSuggestions(value);
  };

  const handleSelect = (location: LocationIQSuggestion) => {
    // Set the City, Venue, Latitude, and Longitude properties from the Location the User has selected
    const city =
      location.address?.city ||
      location.address?.town ||
      location.address?.village;
    const venue = location.display_name;
    const latitude = location.lat;
    const longitude = location.lon;

    // Set the Input Value to the Venue and clear the Suggestions
    setInputValue(venue);

    // Update the Form Value with the City, Venue, Latitude, and Longitude
    field.onChange({ city, venue, latitude, longitude });

    // Clear the Suggestions
    setSuggestions([]);
  };

  return (
    <Box>
      <TextField
        {...props}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        fullWidth
        variant="outlined"
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
      {loading && <Typography>Loading...</Typography>}
      {suggestions.length > 0 && (
        <List sx={{ border: 1 }}>
          {suggestions.map((suggestion) => (
            <ListItemButton
              divider
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion.display_name}
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}
