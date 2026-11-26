import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { middleware } from 'supertokens-node/framework/express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly supertokensMiddleware = middleware();

  use(req: Request, res: Response, next: NextFunction) {
    return this.supertokensMiddleware(req, res, next);
  }
}
