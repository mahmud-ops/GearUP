export interface IRentalOrderPayload {
  startDate: string;
  endDate: string;
  items: {
    gearItemId: string;
    quantity: number;
  }[];
}

export interface IUpdateRentalOrder {
  startDate?: string | Date;
  endDate?: string | Date;
  items?: {
    gearItemId: string;
    quantity: number;
  }[];
}
