export interface IUser {
  id?: number;
  displayName?: string;
  email: string;
  password: string;
  roles: UserRole;
  name: string;
  surname: string;
  username: string;
  orders?: IUserOrdersFood[];
}
export enum UserRole {
  seller = 1,
  buyer = 2,
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Cenceled = 'Cenceled',
}

export interface IUserOrdersFood {
  courseId: string;
  purchaseState: PurchaseState;
}
