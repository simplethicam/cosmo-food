export interface IChart {
  date: string;
  title: "Order Count" | "Order Amount" | "New Customers";
  value: number;
}

export interface IOrderStatus {
  id: number;
  text: "Pending" | "Ready" | "On The Way" | "Delivered" | "Cancelled";
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  createdBy: IUserInfo;
  familyName: string;
  companyId?: string;
  isActive?: boolean;
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IAddress {
  text: string;
  coordinate: [string | number, string | number];
}

export interface IFile {
  lastModified?: number;
  name: string;
  percent?: number;
  size: number;
  status?: "error" | "success" | "done" | "uploading" | "removed";
  type: string;
  uid?: string;
  url: string;
}

export interface IEvent {
  date: string;
  status: string;
}

export interface IStore {
  id: number;
  gsm: string;
  email: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  address: IAddress;
  products: IProduct[];
}

export interface IOrder {
  id: string;
  flowStatus: string;
  companyId: string;
  deletedBy: IUser;
  table: ITable;
  updatedBy: IUser;
  createdBy: IUser;
  isActive: boolean;
  orderNumber: string;
  deleted: boolean;
  products: IProduct[];
  amount: number;
  description: string;
}

export interface IUserInfo {
  name: string;
  date?: string;
  email: string;
  username: string;
}

export interface IOrderProduct {
  product: IProduct;
  quantity: number;
}

export interface IProduct {
  id: string;
  name: string;
  isActive?: boolean;
  description: string;
  price: number;
  categoryId: string;
  images?: (IFile & { thumbnailUrl?: string })[];
  createdAt?: string;
  quantity: number;
}

export interface ICategory {
  id: string;
  title: string;
  isActive: boolean;
}

export interface ITable {
  id: string;
  name: string;
  position?: string;
  companyId?: string;
  isActive?: boolean;
}

export interface IOrderFilterVariables {
  q?: string;
  store?: string;
  user?: string;
  status?: string[];
}

export interface IUserFilterVariables {
  q: string;
  status: boolean;
  gender: string;
  isActive: boolean | string;
}

export interface ICourierStatus {
  id: number;
  text: "Available" | "Offline" | "On delivery";
}

export interface IStaffStatus {
  id: number;
  text: "Available" | "Offline" | "In service";
}

export interface ICourier {
  id: string;
  name: string;
  surname: string;
  email: string;
  gender: string;
  gsm: string;
  createdAt: string;
  accountNumber: string;
  licensePlate: string;
  address: string;
  avatar: IFile[];
  store: IStore;
  status: ICourierStatus;
  vehicle: IVehicle;
}

export interface IAddress {
  city: string;
  province: string;
  street: string;
  zip: string;
}

export interface ICustomer {
  id: string;
  address: IAddress;
  companyName: string;
  email: string;
  fiscalCode: string;
  mobile: string;
  pec: string;
  phone: string;
  sdiCode: string;
  site: string;
  vatId: string;
  name: string;
  gender: string;
  isActive: string;
  lastname: string;
  deleted: string;
  type: string;
}


export interface IStaff {
  id: number;
  name: string;
  surname: string;
  email: string;
  gender: string;
  gsm: string;
  createdAt: string;
  accountNumber: string;
  licensePlate: string;
  address: string;
  avatar: IFile[];
  store: IStore;
  status: IStaffStatus;
  vehicle: IVehicle;
}

export interface IReview {
  id: number;
  order: IOrder;
  user: IUser;
  star: number;
  createDate: string;
  status: "pending" | "approved" | "rejected";
  comment: string[];
}

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}

export type IVehicle = {
  model: string;
  vehicleType: string;
  engineSize: number;
  color: string;
  year: number;
  id: number;
};

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
