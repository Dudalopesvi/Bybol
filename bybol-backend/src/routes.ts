import { Router } from 'express';
import { authRoutes } from './features/auth/auth.routes.js';
import { bookRoutes } from './features/books/book.routes.js';
import { userRoutes } from './features/users/user.routes.js';

export const routes = Router();

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/books', bookRoutes);
