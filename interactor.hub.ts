import { Hub } from './hub';
import { Resolver } from './resolver';
import { UseCase } from './usecase';
import { UseCaseResult } from './usecase.result';
import { UseCaseWrapper } from './usecase.wrapper';

export class InteractorHub implements Hub {
  constructor(private resolver: Resolver) {}

  execute<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase, outputPort: TOutputPort): UseCaseResult {
    const interactor = this.resolver.resolveInteractor(usecase);

    const pipeline = this.resolver.resolveMiddleware(usecase);
    const wrapper = new UseCaseWrapper(interactor, outputPort);

    if (pipeline == null || pipeline.length === 0) {
      return interactor.execute(usecase, outputPort);
    }

    pipeline.push(<any>wrapper);

    var currentMiddleware = 1;
    const nextMiddleware = <TUseCase extends UseCase<TOutputPort>, TOutputPort>(useCase: TUseCase, outputPort: TOutputPort) => {
      return pipeline[currentMiddleware++].run(<any>useCase, <any>outputPort, nextMiddleware);
    }

    return pipeline[0].run(<any>usecase, <any>outputPort, nextMiddleware);
  }
}
