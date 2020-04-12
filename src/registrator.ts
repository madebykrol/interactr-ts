import { Interactor } from './Interactor';
import { Middleware, GlobalMiddleware } from './Middleware';
import { UseCase } from './UseCase';

export abstract class Registrator {
  abstract registerMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(middleware: Middleware<TUseCase, TOutputPort>, type: (new () => TUseCase)):void;
  abstract registerGlobalMiddleware(middleware: GlobalMiddleware):void;
  abstract registerInteractor<TUseCase extends UseCase<TOutputPort>, TOutputPort>(interactor: Interactor<TUseCase, TOutputPort>, type: (new () => TUseCase)):void;
}