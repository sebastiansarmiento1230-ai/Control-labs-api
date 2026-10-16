export type EquipmentType = 'computador' | 'proyector' | 'osciloscopio' | 'impresora 3d' | 'redes' | 'otro';
export type TechnicalStatus = 'operativo' | 'en mantenimiento' | 'fuera de servicio';

export interface IEquipment {
  id: string;
  name: string;
  serialNumber: string;
  type: EquipmentType;
  environmentId: string;
  location: string;
  technicalStatus: TechnicalStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateEquipmentDTO {
  name: string;
  serialNumber: string;
  type: EquipmentType;
  environmentId: string;
  location?: string;
  technicalStatus?: TechnicalStatus;
}

export interface IUpdateEquipmentDTO {
  name?: string;
  serialNumber?: string;
  type?: EquipmentType;
  environmentId?: string;
  location?: string;
  technicalStatus?: TechnicalStatus;
  isActive?: boolean;
}
