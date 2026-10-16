import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/index';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Montaje modular de las rutas de la API bajo el prefijo /api/v1
app.use('/api/v1', apiRoutes);

// Endpoint de verificación de estado (Health Check)
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejador para rutas no encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

export default app;