import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';

const router = Router();

// Módulo 3: Gestión de Equipos (Hardware / Activos)
// Listar todos los equipos existentes o filtrar aquellos asignados a un ambiente específico (?environmentId=...)
router.get('/', EquipmentController.getAllEquipments);

// Registrar un nuevo equipo vinculado a un ambiente de laboratorio
router.post('/', EquipmentController.createEquipment);

// Consultar detalles de un equipo específico
router.get('/:id', EquipmentController.getEquipmentById);

// Actualizar de forma parcial el estado técnico de un equipo (ej. en mantenimiento o ubicación) usando PATCH
router.patch('/:id', EquipmentController.updateEquipmentPartial);

export default router;
