import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller';

const router = Router();

// Módulo 4: Gestión de Novedades (Incidencias)
// Consultar el historial completo de incidencias reportadas
router.get('/', IncidentController.getAllIncidents);

// Crear un reporte de novedad asociándolo a un equipo o ambiente específico
router.post('/', IncidentController.createIncident);

// Consultar detalles de una incidencia específica
router.get('/:id', IncidentController.getIncidentById);

// Actualizar parcialmente el estado de una novedad (ej. pendiente, en proceso, resuelto) mediante PATCH
router.patch('/:id', IncidentController.updateIncidentPartial);

export default router;
