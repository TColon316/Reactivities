type Activity = {
  category: string;
  city: string;
  date: Date;
  description: string;
  id: string;
  isCancelled: boolean;
  latitude: number;
  longitude: number;
  title: string;
  venue: string;
};

export type LocationIQSuggestion = {
  address: LocationIQAddress;
  boundingbox: string[];
  class: string;
  display_address: string;
  display_name: string;
  display_place: string;
  lat: string;
  licence: string;
  lon: string;
  osm_id: string;
  osm_type: string;
  place_id: string;
  type: string;
};

export type LocationIQAddress = {
  city?: string;
  country: string;
  country_code: string;
  county: string;
  house_number: string;
  name: string;
  neighbourhood: string;
  postcode: string;
  road: string;
  state: string;
  suburb?: string;
  town?: string;
  village?: string;
};
