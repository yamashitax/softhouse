export type Person = {
  firstname: string;
  lastname: string;
};

export type Phone = {
  mobile: string;
  landline: string;
};

export type Address = {
  street: string;
  city: string;
  postal_code?: number;
}

export type Family = {
  name: string;
  born: number;
};

export type Type = Person | Phone | Address | Family;

type HashMap = {
  [key in string]: string;
};

export const typeHashMap: HashMap = {
  'P': 'person',
  'T': 'telephone',
  'A': 'address',
  'F': 'family'
};
