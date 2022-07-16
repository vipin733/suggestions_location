export interface Location {
  name: string;
  latitude: string;
  longitude: string;
  distance: Number;
}

export interface LocationDB {
  name: string;
  location: { type: String; coordinates: [Number, Number] };
  location_id: Number;
  distance: Number;
}

export interface LocationRequest {
  query: string;
  latitude: number;
  longitude: number;
  radius: number;
  sort: string;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
}
