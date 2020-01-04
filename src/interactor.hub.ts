import { Hub } from './hub';
import { Resolver } from './resolver';
import { UseCase } from './usecase';
import { UseCaseResult } from './usecase.result';
import { InteractorWrapper } from './interactor.wrapper';
import { Middleware } from './middleware';
import { GlobalMiddlewareWrapper } from './global-middleware.wrapper';

export class InteractorHub implements Hub {
  constructor(private resolver: Resolver) {}

  execute<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase, outputPort: TOutputPort): UseCaseResult {
    const interactor = this.resolver.resolveInteractor(usecase);

    let pipeline = new Array<Middleware<TUseCase, TOutputPort>>()
      .concat(<any>this.resolver.resolveGlobalMiddleware()
        .map(middleware => new GlobalMiddlewareWrapper<TUseCase, TOutputPort>(middleware)))
      .concat(<any>this.resolver.resolveMiddleware(usecase));

    if (pipeline == null || pipeline.length === 0) {
      return interactor.execute(usecase, outputPort);
    }

    const wrapper = new InteractorWrapper(interactor, outputPort);
    pipeline.push(<any>wrapper);

    var currentMiddleware = 1;
    const nextMiddleware = <TUseCase extends UseCase<TOutputPort>, TOutputPort>(useCase: TUseCase) => {
      return pipeline[currentMiddleware++].run(<any>useCase, <any>outputPort, nextMiddleware);
    }

    return pipeline[0].run(<any>usecase, <any>outputPort, nextMiddleware);
  }
}
