export interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface IAccount {
  _id: string;
  paymentID: string;
  profile: IUser;
  balance: number;
}

export interface ITransaction {
  _id: string;
  sender: string;
  receiver: string;
  amount: number;
}
