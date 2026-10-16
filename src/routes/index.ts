import { Router } from 'express';
import userRoutes from './user.routes';
import environmentRoutes from './environment.routes';
import equipmentRoutes from './equipment.routes';
import incidentRoutes from './incident.routes';
import dashboardRoutes from './dashboard.routes';
import loanRoutes from './loan.routes';
import healthRoutes from './health.routes';

const router = Router();

// Mapeo modular de rutas
router.use('/users', userRoutes);
router.use('/environments', environmentRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/incidents', incidentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/loans', loanRoutes);
router.use('/', healthRoutes);

export default router;
