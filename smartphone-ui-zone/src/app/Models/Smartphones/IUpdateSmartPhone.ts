// src/app/Models/Smartphones/IUpdateSmartPhone.ts
import { IAddSmartPhone } from './IAddSmartPhone';

export interface IUpdateSmartPhone extends IAddSmartPhone {
  id: number;
}