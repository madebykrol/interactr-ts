import { Middleware, GlobalMiddleware } from './Middleware';
import { UseCase } from './UseCase';
import { UseCaseResult } from './UseCaseResult';

export class GlobalMiddlewareWrapper<TUseCase extends UseCase<TOutputPort>, TOutputPort> implements Middleware<TUseCase, TOutputPort> {

  constructor(private middleware: GlobalMiddleware) {}

  run(usecase: TUseCase, outputPort: TOutputPort, next: any): Promise<UseCaseResult> {
    return this.middleware.run(usecase, next);
  }
}