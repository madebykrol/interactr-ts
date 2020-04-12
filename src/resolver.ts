import { Interactor } from './Interactor';
import { UseCase } from './UseCase';
import { Middleware, GlobalMiddleware } from './Middleware';

export abstract class Resolver {
  abstract resolveInteractor<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase): Interactor<TUseCase, TOutputPort>;
  abstract resolveMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase): Array<Middleware<TUseCase, TOutputPort>>;
  abstract resolveGlobalMiddleware(): Array<GlobalMiddleware>;
}
