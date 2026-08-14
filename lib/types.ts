export type City = "NJ" | "NYC";

export type PointStatus = "abierto" | "saturado" | "cerrado";

export type NeedPriority = "alta" | "media" | "baja";

export type Need = {
  id: string;
  item: string;
  priority: NeedPriority;
};

export type Point = {
  id: string;
  name: string;
  address: string;
  city: City;
  status: PointStatus;
  mapsUrl: string | null;
  donationInfo: string | null;
  needs: Need[];
  updatedLabel: string;
};
