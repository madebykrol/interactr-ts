import { Interactor } from './interactor';
import { Middleware, GlobalMiddleware } from './middleware';
import { UseCase } from './usecase';

export abstract class Registrator {
  abstract registerMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(middleware: Middleware<TUseCase, TOutputPort>, type: Constructor<TUseCase>):void;
  abstract registerGlobalMiddleware(middleware: GlobalMiddleware):void;
  abstract registerInteractor<TUseCase extends UseCase<TOutputPort>, TOutputPort>(interactor: Interactor<TUseCase, TOutputPort>, type:  Constructor<TUseCase>):void;
}

export type Constructor<T> = new (...args: any[]) => T;