"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
// Middlewares globales
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Montaje modular de las rutas de la API bajo el prefijo /api/v1
app.use('/api/v1', index_1.default);
// Endpoint de verificación de estado (Health Check)
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'ControlLabs API operando correctamente',
        timestamp: new Date().toISOString()
    });
});
// Manejador para rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});
exports.default = app;
