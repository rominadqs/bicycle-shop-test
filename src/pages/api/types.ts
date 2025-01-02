export enum Status {
  Success= "success",
  Fail= "fail",
  Error= "error",
}  

export interface Option {
  id: number;
  characteristicId: number;
  value: string;
  isInStock: boolean;
}

export interface Characteristic {
  id: number;
  productId: number;
  name: string;
  options: Option[];
}