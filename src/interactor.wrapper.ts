import { Middleware } from './middleware';
import { UseCaseResult } from "./usecase.result";
import { Interactor } from './interactor';
import { UseCase } from './usecase';

export class InteractorWrapper<TUseCase extends UseCase<TOutputPort>, TOutputPort> implements Middleware<TUseCase, TOutputPort> {
  constructor(private interactor: Interactor<TUseCase, TOutputPort>, private outputPort: TOutputPort) {  }
  run(usecase: TUseCase, outputPort: TOutputPort, next: Middleware<TUseCase, TOutputPort>): Promise<UseCaseResult> {
    return this.interactor.execute(usecase, this.outputPort);
  }
}
