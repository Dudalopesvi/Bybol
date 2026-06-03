import { Router } from 'express';
import { asyncHandler } from '../../core/http/async-handler.js';
import { authenticate } from '../auth/auth.middleware.js';
import { UserController } from './user.controller.js';

const controller = new UserController();

export const userRoutes = Router();

userRoutes.get('/me', authenticate, asyncHandler(controller.me.bind(controller)));
userRoutes.get('/', authenticate, asyncHandler(controller.index.bind(controller)));
