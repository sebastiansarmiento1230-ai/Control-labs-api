import { Request, Response } from 'express';
import { storeService } from '../services/store.service';
import { ICreateIncidentDTO, IUpdateIncidentDTO, IncidentPriority, IncidentStatus, IncidentTargetType } from '../models/incident.model';

const VALID_PRIORITIES: IncidentPriority[] = ['baja', 'media', 'alta', 'crítica'];
const VALID_STATUSES: IncidentStatus[] = ['pendiente', 'en proceso', 'resuelto'];
const VALID_TARGET_TYPES: IncidentTargetType[] = ['equipo', 'ambiente'];

export class IncidentController {
  /**
   * Consultar el historial completo de incidencias reportadas.
   * GET /api/v1/incidents
   */
  public static getAllIncidents = (req: Request, res: Response): void => {
    try {
      const { status, priority, targetType } = req.query;

      const filters = {
        status: typeof status === 'string' ? status : undefined,
        priority: typeof priority === 'string' ? priority : undefined,
        targetType: typeof targetType === 'string' ? targetType : undefined
      };

      const incidents = storeService.getAllIncidents(filters);

      res.status(200).json({
        success: true,
        count: incidents.length,
        filtersApplied: filters,
        data: incidents
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar el historial de incidencias',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Consultar una novedad específica por su ID.
   * GET /api/v1/incidents/:id
   */
  public static getIncidentById = (req: Request, res: Response): void => {
    try {
      const id = req.params.id as string;
      const incident = storeService.getIncidentById(id);

      if (!incident) {
        res.status(404).json({
          success: false,
          message: `Novedad / Incidencia con identificador '${id}' no encontrada.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: incident
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar la incidencia',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Crear un reporte de novedad asociándolo a un equipo o ambiente específico.
   * POST /api/v1/incidents
   */
  public static createIncident = (req: Request, res: Response): void => {
    try {
      const { title, description, targetType, equipmentId, environmentId, priority, reportedBy } = req.body;

      if (!title || !description || !targetType || !reportedBy) {
        res.status(400).json({
          success: false,
          message: 'Los campos title, description, targetType y reportedBy son obligatorios.'
        });
        return;
      }

      if (!VALID_TARGET_TYPES.includes(targetType)) {
        res.status(400).json({
          success: false,
          message: `targetType '${targetType}' no válido. Debe ser 'equipo' o 'ambiente'.`
        });
        return;
      }

      // Validar asociación específica
      if (targetType === 'equipo') {
        if (!equipmentId) {
          res.status(400).json({
            success: false,
            message: 'Al reportar una novedad sobre equipo, el campo equipmentId es obligatorio.'
          });
          return;
        }
        const eq = storeService.getEquipmentById(equipmentId);
        if (!eq) {
          res.status(400).json({
            success: false,
            message: `El equipo con ID '${equipmentId}' asociado a la novedad no existe.`
          });
          return;
        }
      } else if (targetType === 'ambiente') {
        if (!environmentId) {
          res.status(400).json({
            success: false,
            message: 'Al reportar una novedad sobre ambiente, el campo environmentId es obligatorio.'
          });
          return;
        }
        const env = storeService.getEnvironmentById(environmentId);
        if (!env) {
          res.status(400).json({
            success: false,
            message: `El ambiente con ID '${environmentId}' asociado a la novedad no existe.`
          });
          return;
        }
      }

      if (priority && !VALID_PRIORITIES.includes(priority)) {
        res.status(400).json({
          success: false,
          message: `Prioridad '${priority}' no válida. Valores permitidos: ${VALID_PRIORITIES.join(', ')}.`
        });
        return;
      }

      const dto: ICreateIncidentDTO = {
        title,
        description,
        targetType,
        equipmentId,
        environmentId,
        priority: priority || 'media',
        reportedBy
      };

      const newIncident = storeService.createIncident(dto);

      res.status(201).json({
        success: true,
        message: 'Reporte de novedad creado exitosamente',
        data: newIncident
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar la novedad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Actualizar parcialmente el estado de una novedad (ej. cambiar de "pendiente" a "en proceso" o "resuelto") mediante PATCH.
   * PATCH /api/v1/incidents/:id
   */
  public static updateIncidentPartial = (req: Request, res: Response): void => {
    try {
      const id = req.params.id as string;
      const updateData: IUpdateIncidentDTO = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Debe enviar al menos un atributo para actualizar parcialmente (ej. status, resolutionNotes, priority).'
        });
        return;
      }

      if (updateData.status && !VALID_STATUSES.includes(updateData.status)) {
        res.status(400).json({
          success: false,
          message: `Estado '${updateData.status}' no válido. Valores permitidos: ${VALID_STATUSES.join(', ')}.`
        });
        return;
      }

      if (updateData.priority && !VALID_PRIORITIES.includes(updateData.priority)) {
        res.status(400).json({
          success: false,
          message: `Prioridad '${updateData.priority}' no válida. Valores permitidos: ${VALID_PRIORITIES.join(', ')}.`
        });
        return;
      }

      const updated = storeService.updateIncidentPartial(id, updateData);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Novedad con identificador '${id}' no encontrada.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Estado de la novedad actualizado parcialmente con éxito (PATCH)',
        data: updated
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar parcialmente la novedad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };
}
