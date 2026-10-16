import { IUser, ICreateUserDTO, IUpdateUserDTO } from '../models/user.model';
import { IEnvironment, ICreateEnvironmentDTO, IUpdateEnvironmentDTO } from '../models/environment.model';
import { IEquipment, ICreateEquipmentDTO, IUpdateEquipmentDTO } from '../models/equipment.model';
import { IIncident, ICreateIncidentDTO, IUpdateIncidentDTO } from '../models/incident.model';
import { IDashboardSummary } from '../models/dashboard.model';

class StoreService {
  private users: IUser[] = [
    {
      id: 'usr-1',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@controllabs.edu.co',
      role: 'administrador',
      password: 'hashed_admin_pass_123',
      status: 'activo',
      isActive: true,
      createdAt: '2026-02-15T08:00:00.000Z',
      updatedAt: '2026-02-15T08:00:00.000Z'
    },
    {
      id: 'usr-2',
      name: 'Dra. Sofia Morales',
      email: 'sofia.morales@controllabs.edu.co',
      role: 'docente',
      password: 'hashed_docente_pass_456',
      status: 'activo',
      isActive: true,
      createdAt: '2026-02-18T09:30:00.000Z',
      updatedAt: '2026-02-18T09:30:00.000Z'
    },
    {
      id: 'usr-3',
      name: 'Mateo Valenzuela',
      email: 'mateo.valenzuela@controllabs.edu.co',
      role: 'estudiante',
      password: 'hashed_student_pass_789',
      status: 'activo',
      isActive: true,
      createdAt: '2026-03-01T14:15:00.000Z',
      updatedAt: '2026-03-01T14:15:00.000Z'
    },
    {
      id: 'usr-4',
      name: 'Andrea Gómez',
      email: 'andrea.gomez@controllabs.edu.co',
      role: 'estudiante',
      password: 'hashed_student_pass_012',
      status: 'inactivo',
      isActive: false,
      createdAt: '2026-01-10T10:00:00.000Z',
      updatedAt: '2026-02-01T11:20:00.000Z'
    }
  ];

  private environments: IEnvironment[] = [
    {
      id: 'env-1',
      name: 'Laboratorio de Inteligencia Artificial y Cómputo',
      type: 'laboratorio',
      capacity: 30,
      location: 'Edificio Tecnológico - Piso 3, Sala 301',
      operationalStatus: 'operativo',
      isActive: true,
      createdAt: '2026-01-15T08:00:00.000Z',
      updatedAt: '2026-01-15T08:00:00.000Z'
    },
    {
      id: 'env-2',
      name: 'Laboratorio de Redes y Telecomunicaciones',
      type: 'laboratorio',
      capacity: 25,
      location: 'Edificio Tecnológico - Piso 2, Sala 204',
      operationalStatus: 'operativo',
      isActive: true,
      createdAt: '2026-01-20T08:00:00.000Z',
      updatedAt: '2026-01-20T08:00:00.000Z'
    },
    {
      id: 'env-3',
      name: 'Sala de Prototipado y Robótica',
      type: 'sala',
      capacity: 15,
      location: 'Edificio de Innovación - Piso 1, Sala 102',
      operationalStatus: 'mantenimiento',
      isActive: true,
      createdAt: '2026-02-01T08:00:00.000Z',
      updatedAt: '2026-02-10T10:00:00.000Z'
    }
  ];

  private equipments: IEquipment[] = [
    {
      id: 'eq-1',
      name: 'Estación de Trabajo Dell Precision 3660',
      serialNumber: 'SN-DELL-8821',
      type: 'computador',
      environmentId: 'env-1',
      location: 'Mesa 1 - Puesto A',
      technicalStatus: 'operativo',
      isActive: true,
      createdAt: '2026-01-16T09:00:00.000Z',
      updatedAt: '2026-01-16T09:00:00.000Z'
    },
    {
      id: 'eq-2',
      name: 'Servidor GPU NVIDIA RTX 4090 Deep Learning',
      serialNumber: 'SN-SRV-9943',
      type: 'computador',
      environmentId: 'env-1',
      location: 'Rack 1 - Unidad 4U',
      technicalStatus: 'operativo',
      isActive: true,
      createdAt: '2026-01-18T11:00:00.000Z',
      updatedAt: '2026-01-18T11:00:00.000Z'
    },
    {
      id: 'eq-3',
      name: 'Switch Administrable Cisco Catalyst 2960',
      serialNumber: 'SN-CSCO-1102',
      type: 'redes',
      environmentId: 'env-2',
      location: 'Rack Principal Redes',
      technicalStatus: 'operativo',
      isActive: true,
      createdAt: '2026-01-22T10:30:00.000Z',
      updatedAt: '2026-01-22T10:30:00.000Z'
    },
    {
      id: 'eq-4',
      name: 'Brazo Robótico 6-DOF Educativo KUKA',
      serialNumber: 'SN-KUKA-3301',
      type: 'otro',
      environmentId: 'env-3',
      location: 'Mesa Central de Ensayos',
      technicalStatus: 'en mantenimiento',
      isActive: true,
      createdAt: '2026-02-02T13:00:00.000Z',
      updatedAt: '2026-03-01T15:00:00.000Z'
    }
  ];

  private incidents: IIncident[] = [
    {
      id: 'inc-1',
      title: 'Falla en servomotor eje 3 de articulación',
      description: 'El brazo robótico presenta código de error E-402 por calentamiento',
      targetType: 'equipo',
      equipmentId: 'eq-4',
      priority: 'crítica',
      status: 'pendiente',
      reportedBy: 'Dra. Sofia Morales',
      createdAt: '2026-03-01T14:45:00.000Z',
      updatedAt: '2026-03-01T14:45:00.000Z'
    },
    {
      id: 'inc-2',
      title: 'Falla en equipo de aire acondicionado',
      description: 'Temperatura ambiental superando umbral de 28 grados en zona de cómputo',
      targetType: 'ambiente',
      environmentId: 'env-1',
      priority: 'alta',
      status: 'en proceso',
      reportedBy: 'Carlos Rodríguez',
      createdAt: '2026-03-05T09:15:00.000Z',
      updatedAt: '2026-03-05T11:00:00.000Z'
    },
    {
      id: 'inc-3',
      title: 'Patch cord defectuoso en puerto de red',
      description: 'Conector RJ45 quebrado en el rack de comunicaciones',
      targetType: 'equipo',
      equipmentId: 'eq-3',
      priority: 'baja',
      status: 'resuelto',
      reportedBy: 'Mateo Valenzuela',
      resolutionNotes: 'Se reemplazó cable de parcheo Cat 6 de 1.5m',
      createdAt: '2026-02-25T16:20:00.000Z',
      updatedAt: '2026-02-26T10:00:00.000Z'
    }
  ];

  // ===================== USUARIOS =====================
  public getAllUsers(includeInactive = false): IUser[] {
    if (includeInactive) {
      return [...this.users];
    }
    return this.users.filter(u => u.isActive);
  }

  public getUserById(id: string): IUser | undefined {
    return this.users.find(u => u.id === id);
  }

  public createUser(dto: ICreateUserDTO): IUser {
    const newUser: IUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: dto.name,
      email: dto.email,
      role: dto.role,
      password: dto.password,
      status: 'activo',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  public updateUserPartial(id: string, dto: IUpdateUserDTO): IUser | null {
    const user = this.getUserById(id);
    if (!user) return null;

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.password !== undefined) user.password = dto.password;
    if (dto.status !== undefined) user.status = dto.status;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;

    user.updatedAt = new Date().toISOString();
    return user;
  }

  public deleteUserLogical(id: string): IUser | null {
    const user = this.getUserById(id);
    if (!user) return null;

    user.isActive = false;
    user.status = 'inactivo';
    user.updatedAt = new Date().toISOString();
    return user;
  }

  // ===================== AMBIENTES =====================
  public getAllEnvironments(): IEnvironment[] {
    return this.environments.filter(e => e.isActive);
  }

  public getEnvironmentById(id: string): IEnvironment | undefined {
    return this.environments.find(e => e.id === id);
  }

  public createEnvironment(dto: ICreateEnvironmentDTO): IEnvironment {
    const newEnv: IEnvironment = {
      id: `env-${Date.now().toString(36)}`,
      name: dto.name,
      capacity: dto.capacity,
      location: dto.location,
      type: dto.type || 'laboratorio',
      operationalStatus: dto.operationalStatus || 'operativo',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.environments.push(newEnv);
    return newEnv;
  }

  public updateEnvironmentPartial(id: string, dto: IUpdateEnvironmentDTO): IEnvironment | null {
    const env = this.getEnvironmentById(id);
    if (!env) return null;

    if (dto.name !== undefined) env.name = dto.name;
    if (dto.capacity !== undefined) env.capacity = dto.capacity;
    if (dto.location !== undefined) env.location = dto.location;
    if (dto.operationalStatus !== undefined) env.operationalStatus = dto.operationalStatus;
    if (dto.type !== undefined) env.type = dto.type;
    if (dto.isActive !== undefined) env.isActive = dto.isActive;

    env.updatedAt = new Date().toISOString();
    return env;
  }

  // ===================== EQUIPOS =====================
  public getAllEquipments(environmentId?: string): IEquipment[] {
    let list = this.equipments.filter(eq => eq.isActive);
    if (environmentId) {
      list = list.filter(eq => eq.environmentId === environmentId);
    }
    return list;
  }

  public getEquipmentById(id: string): IEquipment | undefined {
    return this.equipments.find(eq => eq.id === id);
  }

  public createEquipment(dto: ICreateEquipmentDTO): IEquipment {
    const newEq: IEquipment = {
      id: `eq-${Date.now().toString(36)}`,
      name: dto.name,
      serialNumber: dto.serialNumber,
      type: dto.type,
      environmentId: dto.environmentId,
      location: dto.location || 'Ubicación estándar del ambiente',
      technicalStatus: dto.technicalStatus || 'operativo',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.equipments.push(newEq);
    return newEq;
  }

  public updateEquipmentPartial(id: string, dto: IUpdateEquipmentDTO): IEquipment | null {
    const eq = this.getEquipmentById(id);
    if (!eq) return null;

    if (dto.technicalStatus !== undefined) eq.technicalStatus = dto.technicalStatus;
    if (dto.location !== undefined) eq.location = dto.location;
    if (dto.environmentId !== undefined) eq.environmentId = dto.environmentId;
    if (dto.name !== undefined) eq.name = dto.name;
    if (dto.serialNumber !== undefined) eq.serialNumber = dto.serialNumber;
    if (dto.type !== undefined) eq.type = dto.type;
    if (dto.isActive !== undefined) eq.isActive = dto.isActive;

    eq.updatedAt = new Date().toISOString();
    return eq;
  }

  // ===================== NOVEDADES (INCIDENCIAS) =====================
  public getAllIncidents(filters?: { status?: string; priority?: string; targetType?: string }): IIncident[] {
    let list = [...this.incidents];
    if (filters?.status) {
      list = list.filter(inc => inc.status === filters.status);
    }
    if (filters?.priority) {
      list = list.filter(inc => inc.priority === filters.priority);
    }
    if (filters?.targetType) {
      list = list.filter(inc => inc.targetType === filters.targetType);
    }
    return list;
  }

  public getIncidentById(id: string): IIncident | undefined {
    return this.incidents.find(inc => inc.id === id);
  }

  public createIncident(dto: ICreateIncidentDTO): IIncident {
    const newInc: IIncident = {
      id: `inc-${Date.now().toString(36)}`,
      title: dto.title,
      description: dto.description,
      targetType: dto.targetType,
      equipmentId: dto.equipmentId,
      environmentId: dto.environmentId,
      priority: dto.priority || 'media',
      status: 'pendiente',
      reportedBy: dto.reportedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.incidents.push(newInc);
    return newInc;
  }

  public updateIncidentPartial(id: string, dto: IUpdateIncidentDTO): IIncident | null {
    const incident = this.getIncidentById(id);
    if (!incident) return null;

    if (dto.status !== undefined) incident.status = dto.status;
    if (dto.resolutionNotes !== undefined) incident.resolutionNotes = dto.resolutionNotes;
    if (dto.priority !== undefined) incident.priority = dto.priority;
    if (dto.description !== undefined) incident.description = dto.description;
    if (dto.title !== undefined) incident.title = dto.title;

    incident.updatedAt = new Date().toISOString();
    return incident;
  }

  // ===================== DASHBOARD =====================
  public getDashboardSummary(): IDashboardSummary {
    const activeUsers = this.users.filter(u => u.isActive && u.status === 'activo').length;
    const totalUsers = this.users.length;

    const activeEnvironments = this.environments.filter(e => e.isActive && e.operationalStatus === 'operativo').length;
    const totalEnvironments = this.environments.filter(e => e.isActive).length;

    const operationalEquipments = this.equipments.filter(eq => eq.isActive && eq.technicalStatus === 'operativo').length;
    const totalEquipments = this.equipments.filter(eq => eq.isActive).length;

    const unresolvedCriticalIncidents = this.incidents.filter(
      inc => inc.priority === 'crítica' && inc.status !== 'resuelto'
    ).length;
    const totalIncidents = this.incidents.length;

    return {
      counters: {
        totalUsers,
        activeUsers,
        activeEnvironments,
        totalEnvironments,
        operationalEquipments,
        totalEquipments,
        unresolvedCriticalIncidents,
        totalIncidents
      },
      cards: [
        {
          id: 'card-users',
          title: 'Usuarios Activos',
          value: activeUsers,
          total: totalUsers,
          status: 'info',
          subtitle: `${activeUsers} de ${totalUsers} usuarios registrados activos`,
          icon: 'users'
        },
        {
          id: 'card-environments',
          title: 'Ambientes Operativos',
          value: activeEnvironments,
          total: totalEnvironments,
          status: 'success',
          subtitle: `${activeEnvironments} laboratorios y salas en operación`,
          icon: 'layout'
        },
        {
          id: 'card-equipments',
          title: 'Equipos Operativos',
          value: operationalEquipments,
          total: totalEquipments,
          status: operationalEquipments === totalEquipments ? 'success' : 'warning',
          subtitle: `${operationalEquipments} de ${totalEquipments} activos disponibles`,
          icon: 'cpu'
        },
        {
          id: 'card-incidents',
          title: 'Novedades Críticas Sin Resolver',
          value: unresolvedCriticalIncidents,
          status: unresolvedCriticalIncidents > 0 ? 'danger' : 'success',
          subtitle: unresolvedCriticalIncidents > 0
            ? 'Atención inmediata requerida'
            : 'Sin incidencias críticas pendientes',
          icon: 'alert-triangle'
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }
}

export const storeService = new StoreService();
