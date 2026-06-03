import type { Request, Response } from 'express';
import { AppError } from '../../core/errors/app-error.js';
import { BookService } from './book.service.js';

const bookService = new BookService();

const getRouteParam = (req: Request, name: string) => {
  const value = req.params[name];

  if (typeof value !== 'string') {
    throw new AppError(`Parâmetro inválido: ${name}.`, 400, 'INVALID_ROUTE_PARAM');
  }

  return value;
};

export class BookController {
  async index(req: Request, res: Response) {
    const books = await bookService.list();
    return res.json({ data: books });
  }

  async show(req: Request, res: Response) {
    const book = await bookService.find(getRouteParam(req, 'id'));
    return res.json({ data: book });
  }

  async create(req: Request, res: Response) {
    const book = await bookService.create(req.body);
    return res.status(201).json({ data: book });
  }

  async update(req: Request, res: Response) {
    const book = await bookService.update(getRouteParam(req, 'id'), req.body);
    return res.json({ data: book });
  }

  async delete(req: Request, res: Response) {
    await bookService.delete(getRouteParam(req, 'id'));
    return res.status(204).send();
  }
}
