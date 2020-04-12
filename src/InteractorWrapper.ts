import { Middleware } from './Middleware';
import { UseCaseResult } from "./UseCaseResult";
import { Interactor } from './Interactor';
import { UseCase } from './UseCase';

export class InteractorWrapper<TUseCase extends UseCase<TOutputPort>, TOutputPort> implements Middleware<TUseCase, TOutputPort> {
  constructor(private interactor: Interactor<TUseCase, TOutputPort>, private outputPort: TOutputPort) {  }
  run(usecase: TUseCase, outputPort: TOutputPort, next: Middleware<TUseCase, TOutputPort>): Promise<UseCaseResult> {
    return this.interactor.execute(usecase, this.outputPort);
  }
}
