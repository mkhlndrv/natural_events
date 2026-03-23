export interface EarthquakeMetadata {
  generated: number;
  url: string;
  title: string;
  status: number;
  api: string;
  count: number;
}

export interface EarthquakeProperties {
  mag: number | null;
  place: string | null;
  time: number;
  updated: number;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst: number | null;
  dmin: number | null;
  rms: number;
  gap: number | null;
  magType: string | null;
  type: string;
  title: string;
}

export interface EarthquakeGeometry {
  type: 'Point';
  coordinates: [number, number, number]; // [longitude, latitude, depth]
}

export interface EarthquakeFeature {
  type: 'Feature';
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
  id: string;
}

export interface EarthquakeFeatureCollection {
  type: 'FeatureCollection';
  metadata: EarthquakeMetadata;
  features: EarthquakeFeature[];
}
