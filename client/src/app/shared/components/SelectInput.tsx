// Import Material UI TextField component and its prop types
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from '@mui/material';

// Import React Hook Form utilities for controlled inputs
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';

// Define the Props type for this component
type Props<T extends FieldValues> = {
  items: { text: string; value: string }[];
  label: string;
} &
  // Include all props needed by react-hook-form's controller (name, control, rules, etc.)
  UseControllerProps<T> &
  // Include all standard Material UI TextField props (placeholder, disabled, etc.)
  SelectProps;

// Create a reusable TextInput component
export default function SelectInput<T extends FieldValues>(props: Props<T>) {
  // useController connects this input to react-hook-form
  // It returns:
  // - field - contains value, onChange, onBlue, ref (things needed to bind input)
  // - fieldState - contains validation state (error, touched, etc.)
  const { field, fieldState } = useController({ ...props });
  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={field.value || ''}
        label={props.label}
        onChange={field.onChange}
      >
        {props.items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
