import { Request, Response } from 'express';
import { storeService } from '../services/store.service';

export class DashboardController {
  /**
   * Obtener un resumen consolidado con contadores globales de:
   * - usuarios
   * - ambientes activos
   * - equipos operativos
   * - novedades críticas sin resolver
   * Optimizado para renderizar las tarjetas principales del panel de administración.
   * GET /api/v1/dashboard
   * GET /api/v1/dashboard/summary
   */
  public static getDashboardSummary = (req: Request, res: Response): void => {
    try {
      const summary = storeService.getDashboardSummary();

      res.status(200).json({
        success: true,
        message: 'Resumen consolidado del panel de control obtenido exitosamente',
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al generar el resumen del dashboard',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };
}
