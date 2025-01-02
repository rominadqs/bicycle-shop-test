export interface Option {
  id: number;
  value: string;
  isInStock: boolean;
};

export interface Characteristic {
  id: number;
  name: string;
  options: Option[];
}

export interface Rule {
  id: number;
  restrictedCharacteristicId: number;
  restrictedOptionId: number;
  dependsOnCharacteristicId: number;
  dependsOnOptionId: number;
}

export  interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  characteristics: Characteristic[]
  rules: Rule[];
}

export interface NewRule {
  restrictedCharacteristic: string;
  restrictedOption: string;
  dependsOnCharacteristic: string;
  dependsOnOption: string;
}

export interface NewCharacteristic {
  name: string;
  options: string[];
}

export  interface NewProduct {
  name: string;
  description: string;
  basePrice: number;
  category: string;
  characteristics: NewCharacteristic[]
  rules: NewRule[];
}