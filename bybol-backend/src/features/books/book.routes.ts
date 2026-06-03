import { Router } from 'express';
import { asyncHandler } from '../../core/http/async-handler.js';
import { validateBody } from '../../core/validation/validate.js';
import { authenticate } from '../auth/auth.middleware.js';
import { BookController } from './book.controller.js';
import { createBookSchema, updateBookSchema } from './book.schemas.js';

const controller = new BookController();

export const bookRoutes = Router();

bookRoutes.use(authenticate);
bookRoutes.get('/', asyncHandler(controller.index.bind(controller)));
bookRoutes.get('/:id', asyncHandler(controller.show.bind(controller)));
bookRoutes.post('/', validateBody(createBookSchema), asyncHandler(controller.create.bind(controller)));
bookRoutes.patch('/:id', validateBody(updateBookSchema), asyncHandler(controller.update.bind(controller)));
bookRoutes.delete('/:id', asyncHandler(controller.delete.bind(controller)));