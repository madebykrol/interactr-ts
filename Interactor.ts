import { UseCaseResult } from './usecase.result';
import { UseCase } from './usecase';

export abstract class Interactor<TUseCase extends UseCase<TOutputPort>, TOutputPort> {
  abstract execute(usecase: TUseCase, outputPort: TOutputPort): UseCaseResult;
}
