import { Request, Response } from 'express';
import { storeService } from '../services/store.service';
import { ICreateEquipmentDTO, IUpdateEquipmentDTO, TechnicalStatus, EquipmentType } from '../models/equipment.model';

const VALID_TECHNICAL_STATUSES: TechnicalStatus[] = ['operativo', 'en mantenimiento', 'fuera de servicio'];
const VALID_TYPES: EquipmentType[] = ['computador', 'proyector', 'osciloscopio', 'impresora 3d', 'redes', 'otro'];

export class EquipmentController {
  /**
   * Listar todos los equipos existentes o filtrar aquellos asignados a un ambiente específico.
   * GET /api/v1/equipments
   * GET /api/v1/equipments?environmentId=env-1
   */
  public static getAllEquipments = (req: Request, res: Response): void => {
    try {
      const { environmentId, technicalStatus, type } = req.query;

      let equipments = storeService.getAllEquipments(
        typeof environmentId === 'string' ? environmentId : undefined
      );

      if (technicalStatus && typeof technicalStatus === 'string') {
        equipments = equipments.filter(eq => eq.technicalStatus === technicalStatus);
      }

      if (type && typeof type === 'string') {
        equipments = equipments.filter(eq => eq.type === type);
      }

      res.status(200).json({
        success: true,
        count: equipments.length,
        filterApplied: {
          environmentId: environmentId || null,
          technicalStatus: technicalStatus || null,
          type: type || null
        },
        data: equipments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar los equipos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Consultar detalles de un equipo específico por ID.
   * GET /api/v1/equipments/:id
   */
  public static getEquipmentById = (req: Request, res: Response): void => {
    try {
      const id = req.params.id as string;
      const equipment = storeService.getEquipmentById(id);

      if (!equipment) {
        res.status(404).json({
          success: false,
          message: `Equipo con identificador '${id}' no encontrado.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: equipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar el equipo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Registrar un nuevo equipo vinculado a un ambiente de laboratorio.
   * POST /api/v1/equipments
   */
  public static createEquipment = (req: Request, res: Response): void => {
    try {
      const { name, serialNumber, type, environmentId, location, technicalStatus } = req.body;

      if (!name || !serialNumber || !type || !environmentId) {
        res.status(400).json({
          success: false,
          message: 'Los campos name, serialNumber, type y environmentId son obligatorios.'
        });
        return;
      }

      // Validar existencia del ambiente vinculado
      const environmentExists = storeService.getEnvironmentById(environmentId);
      if (!environmentExists) {
        res.status(400).json({
          success: false,
          message: `El ambiente vinculado con ID '${environmentId}' no existe en el sistema.`
        });
        return;
      }

      if (technicalStatus && !VALID_TECHNICAL_STATUSES.includes(technicalStatus)) {
        res.status(400).json({
          success: false,
          message: `Estado técnico '${technicalStatus}' no válido. Valores permitidos: ${VALID_TECHNICAL_STATUSES.join(', ')}.`
        });
        return;
      }

      if (!VALID_TYPES.includes(type)) {
        res.status(400).json({
          success: false,
          message: `Tipo de equipo '${type}' no válido. Valores permitidos: ${VALID_TYPES.join(', ')}.`
        });
        return;
      }

      const dto: ICreateEquipmentDTO = {
        name,
        serialNumber,
        type,
        environmentId,
        location,
        technicalStatus
      };

      const newEquipment = storeService.createEquipment(dto);

      res.status(201).json({
        success: true,
        message: 'Equipo de laboratorio registrado exitosamente y vinculado al ambiente',
        data: newEquipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar el equipo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Actualizar de forma parcial el estado técnico de un equipo (ej. marcarlo como "en mantenimiento" o cambiar su ubicación) usando PATCH.
   * PATCH /api/v1/equipments/:id
   */
  public static updateEquipmentPartial = (req: Request, res: Response): void => {
    try {
      const id = req.params.id as string;
      const updateData: IUpdateEquipmentDTO = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Debe enviar al menos un atributo para actualizar parcialmente (ej. technicalStatus, location, environmentId).'
        });
        return;
      }

      if (updateData.technicalStatus && !VALID_TECHNICAL_STATUSES.includes(updateData.technicalStatus)) {
        res.status(400).json({
          success: false,
          message: `Estado técnico '${updateData.technicalStatus}' no válido. Valores permitidos: ${VALID_TECHNICAL_STATUSES.join(', ')}.`
        });
        return;
      }

      if (updateData.environmentId) {
        const environmentExists = storeService.getEnvironmentById(updateData.environmentId);
        if (!environmentExists) {
          res.status(400).json({
            success: false,
            message: `El ambiente destino con ID '${updateData.environmentId}' no existe.`
          });
          return;
        }
      }

      if (updateData.type && !VALID_TYPES.includes(updateData.type)) {
        res.status(400).json({
          success: false,
          message: `Tipo '${updateData.type}' no válido. Valores permitidos: ${VALID_TYPES.join(', ')}.`
        });
        return;
      }

      const updated = storeService.updateEquipmentPartial(id, updateData);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Equipo con identificador '${id}' no encontrado.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Equipo actualizado parcialmente con éxito (PATCH)',
        data: updated
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar parcialmente el equipo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };
}
