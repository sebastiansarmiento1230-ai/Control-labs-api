import { Router } from 'express';
import { EnvironmentController } from '../controllers/environment.controller';

const router = Router();

// Módulo 2: Gestión de Ambientes (Laboratorios / Salas)
// Listar todos los espacios físicos y laboratorios de ControlLabs
router.get('/', EnvironmentController.getAllEnvironments);

// Crear un nuevo ambiente especificando su capacidad y ubicación
router.post('/', EnvironmentController.createEnvironment);

// Consultar detalles de un ambiente específico
router.get('/:id', EnvironmentController.getEnvironmentById);

// Actualizar atributos específicos de un ambiente (ej. cambiar solo la capacidad o estado operativo) vía PATCH
router.patch('/:id', EnvironmentController.updateEnvironmentPartial);

export default router;
