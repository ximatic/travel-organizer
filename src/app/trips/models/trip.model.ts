export interface TripItem {
  id?: string;
  name: string;
  description?: string;
  type?: string; // clothes, electronics, shoes, accessories, etc.
  size?: string;
  color?: string;
}

export interface Trip {
  id?: string;
  name: string;
  type?: string; // foot, car, train, plane, boat, etc.
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
}
