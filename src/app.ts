import { SelfContainedResolver } from './selfcontained.resolver';
import { UseCase } from './usecase';
import { UseCaseResult } from './usecase.result';
import { Middleware, GlobalMiddleware } from './middleware';
import { Interactor } from './interactor';

import { InteractorHub } from './interactor.hub';
import {Hub} from './hub';

abstract class AbstractFooOutputPort {
  abstract displayMessage(message: string): void;
}

class FooOutputPort implements AbstractFooOutputPort {
  displayMessage(message: string): void { console.log(message); }
}

class FooUseCase extends UseCase<AbstractFooOutputPort> {}

class FooInteractor implements Interactor<FooUseCase, AbstractFooOutputPort> {
  async execute(usecase: FooUseCase, outputPort: AbstractFooOutputPort): Promise<UseCaseResult> {
    outputPort.displayMessage('Foo? Bar!');
    return new UseCaseResult(true);
  }
}

class FooMiddleware implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): Promise<UseCaseResult> {
    console.log('Before interactor 1');

    var result = next(usecase);

    console.log('After interactor 1');

    return result;
  }
}

class FooMiddleware2 implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): Promise<UseCaseResult> {
    console.log('Before interactor 2');

    var result = next(usecase);

    console.log('After interactor 2');

    return result;
  }
}

class FooMiddleware3 implements Middleware<FooUseCase, AbstractFooOutputPort> {
  async run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): Promise<UseCaseResult> {
    outputPort.displayMessage('Terminate pipeline');
    return new UseCaseResult(false);
  }
}

class TerminatingGlobalMiddleware implements GlobalMiddleware {
  async run<T>(usecase: T, next: any): Promise<UseCaseResult> {
    return new UseCaseResult(false);
  }
}


const run = async () => {

  var resolver = new SelfContainedResolver();

  resolver.registerInteractor(new FooInteractor(), FooUseCase);
  resolver.registerMiddleware(new FooMiddleware(), FooUseCase);
  resolver.registerMiddleware(new FooMiddleware2(), FooUseCase);

// resolver.registerGlobalMiddleware(new TerminatingGlobalMiddleware()); // This Global middleware will terminate the pipeline
// resolver.registerMiddleware(new FooMiddleware3(), FooUseCase); // With this middleware registrered the interactor won't execute

  var hub = new InteractorHub(resolver);

  var result = await hub.execute(new FooUseCase(), new FooOutputPort());

  console.log(result.success);
}

run();


export default {Interactor, InteractorHub, Middleware, GlobalMiddleware, UseCase, UseCaseResult, SelfContainedResolver, Hub};