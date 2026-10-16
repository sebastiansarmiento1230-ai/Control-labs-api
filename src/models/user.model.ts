export type UserRole = 'estudiante' | 'docente' | 'administrador';
export type UserStatus = 'activo' | 'inactivo' | 'suspendido';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  status: UserStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateUserDTO {
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface IUpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
  status?: UserStatus;
  isActive?: boolean;
}
