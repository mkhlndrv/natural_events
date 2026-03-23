export interface EonetCategory {
  id: string;
  title: string;
}

export interface EonetSource {
  id: string;
  url: string;
}

export interface EonetGeometry {
  magnitudeValue: number | null;
  magnitudeUnit: string | null;
  date: string;
  type: string;
  coordinates: [number, number];
}

export interface EonetEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: EonetCategory[];
  sources: EonetSource[];
  geometry: EonetGeometry[];
}

export interface EonetResponse {
  title: string;
  description: string;
  link: string;
  events: EonetEvent[];
}

export interface EonetCategoriesResponse {
  title: string;
  description: string;
  link: string;
  categories: EonetCategory[];
}
