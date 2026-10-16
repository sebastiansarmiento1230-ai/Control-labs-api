import { Request, Response } from 'express';
import { storeService } from '../services/store.service';
import { ICreateEnvironmentDTO, IUpdateEnvironmentDTO, EnvironmentOperationalStatus, EnvironmentType } from '../models/environment.model';

const VALID_OPERATIONAL_STATUSES: EnvironmentOperationalStatus[] = ['operativo', 'mantenimiento', 'clausurado'];
const VALID_TYPES: EnvironmentType[] = ['laboratorio', 'sala', 'taller'];

export class EnvironmentController {
  /**
   * Listar todos los espacios físicos y laboratorios de ControlLabs.
   * GET /api/v1/environments
   */
  public static getAllEnvironments = (req: Request, res: Response): void => {
    try {
      const { operationalStatus, type } = req.query;
      let environments = storeService.getAllEnvironments();

      if (operationalStatus && typeof operationalStatus === 'string') {
        environments = environments.filter(e => e.operationalStatus === operationalStatus);
      }

      if (type && typeof type === 'string') {
        environments = environments.filter(e => e.type === type);
      }

      res.status(200).json({
        success: true,
        count: environments.length,
        data: environments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar los ambientes',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Consultar un ambiente específico por ID.
   * GET /api/v1/environments/:id
   */
  public static getEnvironmentById = (req: Request, res: Response): void => {
    try {
      const id = req.params.id as string;
      const environment = storeService.getEnvironmentById(id);

      if (!environment) {
        res.status(404).json({
          success: false,
          message: `Ambiente con identificador '${id}' no encontrado.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: environment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar el ambiente',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Crear un nuevo ambiente especificando su capacidad y ubicación.
   * POST /api/v1/environments
   */
  public static createEnvironment = (req: Request, res: Response): void => {
    try {
      const { name, capacity, location, type, operationalStatus } = req.body;

      if (!name || capacity === undefined || !location) {
        res.status(400).json({
          success: false,
          message: 'Los campos name, capacity y location son obligatorios al crear un ambiente.'
        });
        return;
      }

      if (typeof capacity !== 'number' || capacity <= 0) {
        res.status(400).json({
          success: false,
          message: 'La capacidad debe ser un número entero positivo mayor a cero.'
        });
        return;
      }

      if (operationalStatus && !VALID_OPERATIONAL_STATUSES.includes(operationalStatus)) {
        res.status(400).json({
          success: false,
          message: `Estado operativo '${operationalStatus}' no válido. Valores permitidos: ${VALID_OPERATIONAL_STATUSES.join(', ')}.`
        });
        return;
      }

      if (type && !VALID_TYPES.includes(type)) {
        res.status(400).json({
          success: false,
          message: `Tipo de ambiente '${type}' no válido. Valores permitidos: ${VALID_TYPES.join(', ')}.`
        });
        return;
      }

      const dto: ICreateEnvironmentDTO = {
        name,
        capacity,
        location,
        type,
        operationalStatus
      };

      const newEnvironment = storeService.createEnvironment(dto);

      res.status(201).json({
        success: true,
        message: 'Ambiente o laboratorio registrado exitosamente',
        data: newEnvironment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear el ambiente',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Actualizar atributos específicos de un ambiente vía PATCH (ej. cambiar solo la capacidad o estado operativo).
   * PATCH /api/v1/environments/:id
   */
  public static updateEnvironmentPartial = (req: Request, res: Response): void => {
    try {
      const id = req.params.id as string;
      const updateData: IUpdateEnvironmentDTO = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Debe enviar al menos un atributo para actualizar parcialmente (ej. capacity, operationalStatus, location).'
        });
        return;
      }

      if (updateData.capacity !== undefined && (typeof updateData.capacity !== 'number' || updateData.capacity <= 0)) {
        res.status(400).json({
          success: false,
          message: 'La capacidad debe ser un número positivo.'
        });
        return;
      }

      if (updateData.operationalStatus && !VALID_OPERATIONAL_STATUSES.includes(updateData.operationalStatus)) {
        res.status(400).json({
          success: false,
          message: `Estado operativo '${updateData.operationalStatus}' no válido. Valores permitidos: ${VALID_OPERATIONAL_STATUSES.join(', ')}.`
        });
        return;
      }

      if (updateData.type && !VALID_TYPES.includes(updateData.type)) {
        res.status(400).json({
          success: false,
          message: `Tipo '${updateData.type}' no válido. Valores permitidos: ${VALID_TYPES.join(', ')}.`
        });
        return;
      }

      const updated = storeService.updateEnvironmentPartial(id, updateData);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Ambiente con identificador '${id}' no encontrado.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ambiente actualizado parcialmente con éxito (PATCH)',
        data: updated
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar parcialmente el ambiente',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };
}
