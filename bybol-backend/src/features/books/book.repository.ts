import type { PrismaClient } from '@prisma/client';
import type { CreateBookInput, UpdateBookInput } from './book.schemas.js';

export class BookRepository {
  constructor(
    protected readonly prisma: PrismaClient
  ) {}

  findMany() {
    return this.prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.book.findFirst({
      where: { id },
    });
  }

  create(data: CreateBookInput) {
    return this.prisma.book.create({
      data: {
        ...data
      },
    });
  }

  update(id: string, data: UpdateBookInput) {
    return this.prisma.book.updateMany({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.book.deleteMany({
      where: { id },
    });
  }
}