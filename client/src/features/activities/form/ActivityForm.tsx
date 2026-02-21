import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useActivities } from '../../../lib/hooks/useActivities';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function ActivityForm() {
  const { id } = useParams();
  const { activity, createActivity, isLoadingActivity, updateActivity } =
    useActivities(id);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get the Form Data
    const formData = new FormData(event.currentTarget);

    // Convert the Form Data to an unknown Object (to be cast later to an Activity)
    const data: { [key: string]: FormDataEntryValue } = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // If an Activity is provided, update it otherwise create a new Activity
    if (activity) {
      // The Activity should have an id, so we need to set it on the "unknown" data object
      data.id = activity.id;

      // Cast the "unknown" data object to an Activity and then pass it to the UpdateActivity method to Update the Activity
      await updateActivity.mutateAsync(data as unknown as Activity);

      // Navigate to the Activity Details page
      navigate(`/activities/${activity.id}`);
    } else {
      // Cast the "unknown" data object to an Activity and then pass it to the CreateActivity method to Create the new Activity
      createActivity.mutate(data as unknown as Activity, {
        onSuccess: (id) => {
          navigate(`/activities/${id}`);
        },
      });
    }
  };

  if (isLoadingActivity) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {activity ? 'Edit Activity' : 'Create Activity'}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <TextField name="title" label="Title" defaultValue={activity?.title} />
        <TextField
          name="description"
          label="Description"
          defaultValue={activity?.description}
          multiline
          rows={3}
        />
        <TextField
          name="category"
          label="Category"
          defaultValue={activity?.category}
        />
        <TextField
          name="date"
          label="Date"
          defaultValue={
            activity?.date
              ? new Date(activity.date).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          }
          type="date"
        />
        <TextField name="city" label="City" defaultValue={activity?.city} />
        <TextField name="venue" label="Venue" defaultValue={activity?.venue} />
        <Box display="flex" justifyContent="end" gap={3}>
          <Button color="inherit">Cancel</Button>
          <Button
            color="success"
            type="submit"
            variant="contained"
            disabled={createActivity.isPending || updateActivity.isPending}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
