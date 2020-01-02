import { UseCaseResult } from './usecase.result';
import { UseCase } from './usecase';

export abstract class Hub {
  abstract execute<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase, outputPort: TOutputPort): UseCaseResult;
}
