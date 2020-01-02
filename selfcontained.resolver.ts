import { Resolver } from './resolver';
import { Interactor } from './interactor';
import { UseCase } from "./usecase";
import { Middleware } from './middleware';

export class SelfContainedResolver implements Resolver {
  resolveMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase): Middleware<TUseCase, TOutputPort>[] {
      throw new Error("Method not implemented.");
  }
  resolveInteractor<TUseCase, TOutputPort>(): Interactor<TUseCase, TOutputPort> {
       throw new Error('Not implemented');
  }
}
