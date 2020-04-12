import { UseCaseResult } from './UseCaseResult';
import { UseCase } from './UseCase';

export abstract class Hub {
  abstract execute<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase, outputPort: TOutputPort): Promise<UseCaseResult>;
}
