import { UseCaseResult } from './UseCaseResult';
import { UseCase } from './UseCase';

export abstract class Interactor<TUseCase extends UseCase<TOutputPort>, TOutputPort> {
  abstract execute(usecase: TUseCase, outputPort: TOutputPort): Promise<UseCaseResult>;
}
