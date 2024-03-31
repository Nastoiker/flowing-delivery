export enum UserRole {
  seller = 1,
  buye = 2,
}
export interface IUser {
  id?: number;
  displayName?: string;
  email: string;
  password: string;
  role: UserRole;
}
