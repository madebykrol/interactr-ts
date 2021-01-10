import { Middleware, GlobalMiddleware } from './middleware';
import { UseCase } from './usecase';
import { UseCaseResult } from './usecase.result';

export class GlobalMiddlewareWrapper<TUseCase extends UseCase<TOutputPort>, TOutputPort> implements Middleware<TUseCase, TOutputPort> {

  constructor(private middleware: GlobalMiddleware) {}

  run(usecase: TUseCase, outputPort: TOutputPort, next: any): Promise<UseCaseResult> {
    return this.middleware.run(usecase, next);
  }
}