export type IncidentTargetType = 'equipo' | 'ambiente';
export type IncidentPriority = 'baja' | 'media' | 'alta' | 'crítica';
export type IncidentStatus = 'pendiente' | 'en proceso' | 'resuelto';

export interface IIncident {
  id: string;
  title: string;
  description: string;
  targetType: IncidentTargetType;
  equipmentId?: string;
  environmentId?: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  reportedBy: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateIncidentDTO {
  title: string;
  description: string;
  targetType: IncidentTargetType;
  equipmentId?: string;
  environmentId?: string;
  priority?: IncidentPriority;
  reportedBy: string;
}

export interface IUpdateIncidentDTO {
  status?: IncidentStatus;
  resolutionNotes?: string;
  priority?: IncidentPriority;
  description?: string;
  title?: string;
}
