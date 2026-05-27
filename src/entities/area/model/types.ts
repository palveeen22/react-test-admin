export interface AreaHouse {
  address: string;
  id: string;
}

export interface Area {
  id: string;
  number: number;
  str_number_full: string;
  house: AreaHouse;
}

export interface AreasResponse {
  count: number;
  results: Area[];
}
