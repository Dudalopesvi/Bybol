import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../../config/env.js';
import { AppError } from '../../core/errors/app-error.js';
import { prisma } from '../../core/prisma/client.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';

type JwtPayload = {
  sub: string;
  organizationIds: string[];
};

const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
};

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

    if (existingUser) {
      throw new AppError('E-mail já cadastrado.', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const existingOrganization = await prisma.organization.findUnique({ where: { slug: input.organizationSlug } });

    if (existingOrganization) {
      throw new AppError('Slug da organização já está em uso.', 409, 'ORGANIZATION_SLUG_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: input.organizationName,
          slug: input.organizationSlug,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: Role.OWNER,
        },
      });

      return { user, organization };
    });

    const token = signToken({ sub: result.user.id, organizationIds: [result.organization.id] });

    return {
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
      organization: result.organization,
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { memberships: true },
    });

    if (!user) {
      throw new AppError('Credenciais inválidas.', 401, 'INVALID_CREDENTIALS');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError('Credenciais inválidas.', 401, 'INVALID_CREDENTIALS');
    }

    const organizationIds = user.memberships.map((membership) => membership.organizationId);
    const token = signToken({ sub: user.id, organizationIds });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      organizations: user.memberships.map((membership) => ({
        id: membership.organizationId,
        role: membership.role,
      })),
    };
  }
}
