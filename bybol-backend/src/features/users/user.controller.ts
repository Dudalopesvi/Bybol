import type { Request, Response } from 'express';
import { AppError } from '../../core/errors/app-error.js';
import { UserService } from './user.service.js';

const userService = new UserService();

export class UserController {
  async me(req: Request, res: Response) {
    if (!req.auth?.userId) {
      throw new AppError('Usuário não autenticado.', 401, 'UNAUTHENTICATED');
    }

    const user = await userService.getMe(req.auth.userId);
    return res.json({ data: user });
  }

  async index(req: Request, res: Response) {
    return res.json({ data: [] });
  }
}
