export interface IAddress {
  user_id: number;
  address_type: "HOME" | "INVOICE" | "POST" | "WORK";
  valid_from: string; // w SQL jest TIMESTAMP, w JS string
  post_code: string;
  city: string;
  country_code: string;
  street: string;
  building_number: string;
  created_at: string;
  updated_at: string;
}

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  initials: string;
  email: string;
  status: string;
  createdAt: string;
}
