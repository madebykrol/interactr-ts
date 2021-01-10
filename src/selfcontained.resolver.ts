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

    const middleware = this.middleware.get(usecase.constructor.name);
    if (middleware == undefined)
      return new Array<Middleware<TUseCase, TOutputPort>>();

    return middleware as Array<Middleware<TUseCase, TOutputPort>>;
  }

  resolveInteractor<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase): Interactor<TUseCase, TOutputPort> {
    return this.interactors.get(usecase.constructor.name) as Interactor<TUseCase, TOutputPort>;
  }

  resolveGlobalMiddleware(): Array<GlobalMiddleware> {
    return this.globalMiddleware;
  }

  registerMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(middleware: Middleware<TUseCase, TOutputPort>, type: (new (...args: any[]) => TUseCase)):void {
    if (this.middleware.get(type.name) === undefined) {
      this.middleware.set(type.name, new Array());
    }

    (this.middleware.get(type.name) as Array<Middleware<TUseCase, TOutputPort>>).push(middleware);
  }

  registerInteractor<TUseCase extends UseCase<TOutputPort>, TOutputPort>(interactor: Interactor<TUseCase, TOutputPort>, type: (new (...args: any[]) => TUseCase)):void {
    this.interactors.set(type.name, interactor);
  }

  registerGlobalMiddleware(middleware: GlobalMiddleware):void {
    this.globalMiddleware.push(middleware);
  }
}
