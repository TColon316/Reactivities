import { Box, Button, Paper, Typography } from '@mui/material';
import { useActivities } from '../../../lib/hooks/useActivities';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import {
  activitySchema,
  type ActivityFormValues,
  type ActivitySchema,
} from '../../../lib/schemas/activitySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from '../../../app/shared/components/TextInput';
import SelectInput from '../../../app/shared/components/SelectInput';
import { categoryOptions } from './categoryOptions';
import DateTimeInput from '../../../app/shared/components/DateTimeInput';
import LocationInput from '../../../app/shared/components/LocationInput';

export default function ActivityForm() {
  const { control, handleSubmit, reset } = useForm<
    ActivityFormValues,
    unknown,
    ActivitySchema
  >({
    mode: 'onTouched',
    resolver: zodResolver(activitySchema),
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const { activity, createActivity, isLoadingActivity, updateActivity } =
    useActivities(id);

  useEffect(() => {
    if (activity) reset({
      ...activity,
      location: {
        city: activity.city,
        venue: activity.venue,
        latitude: activity.latitude,
        longitude: activity.longitude,
      }
    });
  }, [activity, reset]);

  const onSubmit = async (data: ActivitySchema) => {
    const {location, ...rest} = data;
    const flattenedData = { ...rest, ...location };

    try {
      if (activity) {
        updateActivity.mutate({ ...activity, ...flattenedData }, {
          onSuccess: () => navigate(`/activities/${activity.id}`),
        })
      } else {
        createActivity.mutate(flattenedData, {
          onSuccess: (id) => navigate(`/activities/${id}`),
        })
      }
    } catch (error) {
      console.error(error);
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
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <TextInput control={control} label="Title" name="title" />
        <TextInput
          control={control}
          label="Description"
          multiline
          name="description"
          rows={3}
        />

        <Box display="flex" gap={3}>
          <SelectInput
            control={control}
            items={categoryOptions}
            label="Category"
            name="category"
          />
          <DateTimeInput control={control} label="Date" name="date" />
        </Box>

        <LocationInput
          control={control}
          label="Enter the Location"
          name="location"
        />

        <Box display="flex" justifyContent="end" gap={3}>
          <Button color="inherit">Cancel</Button>
          <Button
            color="success"
            disabled={createActivity.isPending || updateActivity.isPending}
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
