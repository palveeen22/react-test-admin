export interface MeterArea {
  id: string;
}

export interface Meter {
  id: string;
  _type: string[];
  area: MeterArea;
  is_automatic: boolean | null;
  description: string | null;
  installation_date: string | null;
  initial_values: number[];
}

export interface MetersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Meter[];
}
