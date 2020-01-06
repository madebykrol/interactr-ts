import { Resolver } from './resolver';
import { Registrator } from './registrator';
import { Interactor } from './interactor';
import { UseCase } from "./usecase";
import { Middleware, GlobalMiddleware } from './middleware';

export class SelfContainedResolver implements Resolver, Registrator {

  private interactors: Map<string, any> = new Map();
  private middleware: Map<string, any[]> = new Map();
  private globalMiddleware: Array<GlobalMiddleware> = new Array();

  resolveMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase): Middleware<TUseCase, TOutputPort>[] {
    return this.middleware[usecase.constructor.name];
  }

  resolveInteractor<TUseCase, TOutputPort>(usecase: TUseCase): Interactor<TUseCase, TOutputPort> {
    return this.interactors[usecase.constructor.name];
  }

  resolveGlobalMiddleware(): Array<GlobalMiddleware> {
    return this.globalMiddleware;
  }

  registerMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(middleware: Middleware<TUseCase, TOutputPort>, type: (new () => TUseCase)) {
    if (this.middleware[type.name] === undefined) {
      this.middleware[type.name] = new Array();
    }

    this.middleware[type.name].push(middleware);
  }

  registerInteractor<TUseCase extends UseCase<TOutputPort>, TOutputPort>(interactor: Interactor<TUseCase, TOutputPort>, type: (new () => TUseCase)) {
    this.interactors[type.name] = interactor;
  }

  registerGlobalMiddleware(middleware: GlobalMiddleware) {
    this.globalMiddleware.push(middleware);
  }
}
