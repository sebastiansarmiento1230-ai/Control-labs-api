export type EnvironmentType = 'laboratorio' | 'sala' | 'taller';
export type EnvironmentOperationalStatus = 'operativo' | 'mantenimiento' | 'clausurado';

export interface IEnvironment {
  id: string;
  name: string;
  type: EnvironmentType;
  capacity: number;
  location: string;
  operationalStatus: EnvironmentOperationalStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateEnvironmentDTO {
  name: string;
  capacity: number;
  location: string;
  type?: EnvironmentType;
  operationalStatus?: EnvironmentOperationalStatus;
}

export interface IUpdateEnvironmentDTO {
  name?: string;
  type?: EnvironmentType;
  capacity?: number;
  location?: string;
  operationalStatus?: EnvironmentOperationalStatus;
  isActive?: boolean;
}
