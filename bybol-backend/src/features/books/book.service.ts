import { AppError } from '../../core/errors/app-error.js';
import { prisma } from '../../core/prisma/client.js';
import { BookRepository } from './book.repository.js';
import type { CreateBookInput, UpdateBookInput } from './book.schemas.js';

export class BookService {
  private repository() {
    return new BookRepository(prisma);
  }

  list() {
    return this.repository().findMany();
  }

  async find(id: string) {
    const book = await this.repository().findById(id);

    if (!book) {
      throw new AppError('Book não encontrado.', 404, 'BOOK_NOT_FOUND');
    }

    return book;
  }

  create(data: CreateBookInput) {
    return this.repository().create(data);
  }

  async update(id: string, data: UpdateBookInput) {
    const result = await this.repository().update(id, data);

    if (result.count === 0) {
      throw new AppError('Book não encontrado.', 404, 'BOOK_NOT_FOUND');
    }

    return this.find(id);
  }

  async delete(id: string) {
    const result = await this.repository().delete(id);

    if (result.count === 0) {
      throw new AppError('Book não encontrado.', 404, 'BOOK_NOT_FOUND');
    }
  }
}
