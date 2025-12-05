// src/app/Models/Smartphones/ISmartphoneRead.ts
export interface ISmartphoneRead {
  id: number;
  name: string;
  description: string;
  manufacturerId: number;
  manufacturerName: string;
  specId: number;
  specName: string;
}