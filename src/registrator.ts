import { Interactor } from './interactor';
import { Middleware } from './middleware';
import { UseCase } from './usecase';

export abstract class Registrator {
  abstract registerMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(middleware: Middleware<TUseCase, TOutputPort>, type: (new () => TUseCase));
  abstract registerInteractor<TUseCase extends UseCase<TOutputPort>, TOutputPort>(interactor: Interactor<TUseCase, TOutputPort>, type: (new () => TUseCase));
}