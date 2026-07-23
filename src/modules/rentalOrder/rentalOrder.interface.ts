export type TCreateRentalOrder = {
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

export type TUpdateOrderStatus = {
  status: 'CONFIRMED' | 'PICKEDUP' | 'RETURNED';
}

export type TRentalOrder = {
  id: string;
  customerId: string;
  providerId: string;
  startDate: Date;
  endDate: Date;
  status: 'CONFIRMED' | 'PICKEDUP' | 'RETURNED';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};