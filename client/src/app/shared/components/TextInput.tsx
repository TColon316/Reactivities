// Import Material UI TextField component and its prop types
import { TextField, type TextFieldProps } from '@mui/material';

// Import React Hook Form utilities for controlled inputs
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';

// Define the Props type for this component
type Props<T extends FieldValues> = {
  label: string; // Require a label prop (used by MUI TextField)
} &
  // Include all props needed by react-hook-form's controller (name, control, rules, etc.)
  UseControllerProps<T> &
  // Include all standard Material UI TextField props (placeholder, disabled, etc.)
  TextFieldProps;

// Create a reusable TextInput component
export default function TextInput<T extends FieldValues>(props: Props<T>) {
  // useController connects this input to react-hook-form
  // It returns:
  // - field - contains value, onChange, onBlue, ref (things needed to bind input)
  // - fieldState - contains validation state (error, touched, etc.)
  const { field, fieldState } = useController({ ...props });
  return (
    <TextField
      {...props} // Spreads ALL incoming props (label, type, etc.)
      {...field} // Spread react-hook-form field bindings: value, onChange, onBlur, ref
      error={!!fieldState.error} // If there's a validation error, set error state to true
      fullWidth // Make the input take up full width of its container
      helperText={fieldState.error?.message} // Show validation error message (if exists) under the input
      value={field.value || ''}
      variant="outlined" // Use MUI "outlined" style (bordered input)
    />
  );
}
