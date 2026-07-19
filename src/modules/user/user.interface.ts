export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
}
