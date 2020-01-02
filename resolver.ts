import { Interactor } from './interactor';
import { UseCase } from './usecase';
import { Middleware } from './middleware';

export abstract class Resolver {
  abstract resolveInteractor<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase): Interactor<TUseCase, TOutputPort>;
  abstract resolveMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase): Array<Middleware<TUseCase, TOutputPort>>;
}
