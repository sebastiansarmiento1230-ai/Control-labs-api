import { Request, Response } from 'express';
import { storeService } from '../services/store.service';
import { ICreateUserDTO, IUpdateUserDTO, UserRole, UserStatus } from '../models/user.model';

const VALID_ROLES: UserRole[] = ['estudiante', 'docente', 'administrador'];
const VALID_STATUSES: UserStatus[] = ['activo', 'inactivo', 'suspendido'];

export class UserController {
  /**
   * Obtener el listado completo de usuarios registrados en el sistema.
   * GET /api/v1/users
   */
  public static getAllUsers = (req: Request, res: Response): void => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const roleFilter = req.query.role as UserRole | undefined;

      let users = storeService.getAllUsers(includeInactive);

      if (roleFilter && VALID_ROLES.includes(roleFilter)) {
        users = users.filter(u => u.role === roleFilter);
      }

      // Proteger contraseñas en la respuesta
      const sanitizedUsers = users.map(({ password, ...userWithoutPass }) => userWithoutPass);

      res.status(200).json({
        success: true,
        count: sanitizedUsers.length,
        data: sanitizedUsers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Consultar los detalles de un usuario específico mediante su identificador único.
   * GET /api/v1/users/:id
   */
  public static getUserById = (req: Request, res: Response): void => {
    try {
      const id = req.params.id as string;
      const user = storeService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: `Usuario con identificador '${id}' no encontrado.`
        });
        return;
      }

      const { password, ...userWithoutPass } = user;
      res.status(200).json({
        success: true,
        data: userWithoutPass
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Registrar un nuevo perfil de usuario (estudiante, docente, administrador).
   * POST /api/v1/users
   */
  public static createUser = (req: Request, res: Response): void => {
    try {
      const { name, email, role, password } = req.body;

      if (!name || !email || !role || !password) {
        res.status(400).json({
          success: false,
          message: 'Los campos name, email, role y password son obligatorios.'
        });
        return;
      }

      if (!VALID_ROLES.includes(role)) {
        res.status(400).json({
          success: false,
          message: `Rol no válido '${role}'. Los roles permitidos son: ${VALID_ROLES.join(', ')}.`
        });
        return;
      }

      const dto: ICreateUserDTO = { name, email, role, password };
      const created = storeService.createUser(dto);

      const { password: _, ...userWithoutPass } = created;
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: userWithoutPass
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Actualizar parcialmente el rol, estado de cuenta o contraseña de un usuario específico (PATCH).
   * PATCH /api/v1/users/:id
   */
  public static updateUserPartial = (req: Request, res: Response): void => {
    try {
      const id = req.params.id as string;
      const updateData: IUpdateUserDTO = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Debe proporcionar al menos un campo para actualizar parcialmente (ej. role, status, password, name).'
        });
        return;
      }

      if (updateData.role && !VALID_ROLES.includes(updateData.role)) {
        res.status(400).json({
          success: false,
          message: `Rol '${updateData.role}' no válido. Roles permitidos: ${VALID_ROLES.join(', ')}.`
        });
        return;
      }

      if (updateData.status && !VALID_STATUSES.includes(updateData.status)) {
        res.status(400).json({
          success: false,
          message: `Estado '${updateData.status}' no válido. Estados permitidos: ${VALID_STATUSES.join(', ')}.`
        });
        return;
      }

      const updated = storeService.updateUserPartial(id, updateData);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Usuario con identificador '${id}' no encontrado para actualizar.`
        });
        return;
      }

      const { password, ...userWithoutPass } = updated;
      res.status(200).json({
        success: true,
        message: 'Usuario actualizado parcialmente con éxito (PATCH)',
        data: userWithoutPass
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar parcialmente el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Eliminar lógicamente un usuario del sistema.
   * DELETE /api/v1/users/:id
   */
  public static deleteUserLogical = (req: Request, res: Response): void => {
    try {
      const id = req.params.id as string;
      const deleted = storeService.deleteUserLogical(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Usuario con identificador '${id}' no encontrado para eliminar.`
        });
        return;
      }

      const { password, ...userWithoutPass } = deleted;
      res.status(200).json({
        success: true,
        message: 'Usuario eliminado lógicamente (isActive = false, status = inactivo).',
        data: userWithoutPass
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar lógicamente el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };
}
