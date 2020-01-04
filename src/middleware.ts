import { UseCaseResult } from './usecase.result';
import { UseCase } from './usecase';

export abstract class Middleware<TUseCase extends UseCase<TOutputPort>, TOutputPort> {
  abstract run(usecase: TUseCase, outputPort: TOutputPort, next: any): UseCaseResult;
}

export abstract class GlobalMiddleware {
  abstract run<TUseCase>(usecase: TUseCase, next: any): UseCaseResult;
}
