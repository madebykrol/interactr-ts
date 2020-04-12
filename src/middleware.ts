import { UseCaseResult } from './UseCaseResult';
import { UseCase } from './UseCase';

export abstract class Middleware<TUseCase extends UseCase<TOutputPort>, TOutputPort> {
  abstract run(usecase: TUseCase, outputPort: TOutputPort, next: any): Promise<UseCaseResult>;
}

export abstract class GlobalMiddleware {
  abstract run<TUseCase>(usecase: TUseCase, next: any): Promise<UseCaseResult>;
}
