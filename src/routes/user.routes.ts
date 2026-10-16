import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

// Módulo 1: Gestión de Usuarios
// Obtener el listado completo de usuarios registrados en el sistema
router.get('/', UserController.getAllUsers);

// Registrar un nuevo perfil de usuario (estudiante, docente, administrador)
router.post('/', UserController.createUser);

// Consultar los detalles de un usuario específico mediante su identificador único
router.get('/:id', UserController.getUserById);

// Actualizar parcialmente el rol, estado de cuenta o contraseña de un usuario específico (PATCH)
router.patch('/:id', UserController.updateUserPartial);

// Eliminar lógicamente un usuario del sistema
router.delete('/:id', UserController.deleteUserLogical);

export default router;
