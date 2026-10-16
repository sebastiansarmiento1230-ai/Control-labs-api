import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();

// Módulo 5: Dashboard (Panel de Control y Analítica)
// Obtener un resumen consolidado con contadores globales para renderizar las tarjetas del panel de administración
router.get('/', DashboardController.getDashboardSummary);
router.get('/summary', DashboardController.getDashboardSummary);

export default router;
