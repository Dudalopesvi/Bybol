import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { env } from '../../config/env.js';
import { AppError } from '../../core/errors/app-error.js';

type DecodedToken = {
  sub: string;
  organizationIds: string[];
};

export const authenticate: RequestHandler = (req, _res, next) => {
  const authorization = req.header('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticação não informado.', 401, 'AUTH_TOKEN_REQUIRED'));
  }

  const token = authorization.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;
    req.auth = {
      userId: decoded.sub,
      organizationIds: decoded.organizationIds ?? [],
    };
    return next();
  } catch {
    return next(new AppError('Token de autenticação inválido.', 401, 'AUTH_TOKEN_INVALID'));
  }
};
