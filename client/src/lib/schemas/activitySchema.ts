import { z } from 'zod';

const requiredString = (fieldName: string) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(1, { error: `${fieldName} is required` });

export const activitySchema = z.object({
  category: requiredString('Category'),
  date: z.coerce.date({
    message: 'Date is required',
  }),
  description: requiredString('Description'),
  title: requiredString('Title'),
  location: z.object({
    venue: requiredString('Venue'),
    city: z.string().optional(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  })
});

export type ActivityFormValues = z.input<typeof activitySchema>;
export type ActivitySchema = z.output<typeof activitySchema>;
