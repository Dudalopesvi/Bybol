import { Router } from 'express';
import { asyncHandler } from '../../core/http/async-handler.js';
import { validateBody } from '../../core/validation/validate.js';
import { AuthController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schemas.js';

const controller = new AuthController();

export const authRoutes = Router();

authRoutes.post('/register', validateBody(registerSchema), asyncHandler(controller.register.bind(controller)));
authRoutes.post('/login', validateBody(loginSchema), asyncHandler(controller.login.bind(controller)));
