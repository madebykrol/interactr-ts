import { SelfContainedResolver } from './selfcontained.resolver';
import { UseCase } from './usecase';
import { UseCaseResult } from './usecase.result';
import { Middleware, GlobalMiddleware } from './middleware';
import { Interactor } from './interactor';

import { InteractorHub } from './interactor.hub';

abstract class AbstractFooOutputPort {
  abstract displayMessage(message: string): void;
}

class FooOutputPort implements AbstractFooOutputPort {
  displayMessage(message: string): void { console.log(message); }
}

class FooUseCase extends UseCase<AbstractFooOutputPort> {}

class FooInteractor implements Interactor<FooUseCase, AbstractFooOutputPort> {
  execute(usecase: FooUseCase, outputPort: AbstractFooOutputPort): UseCaseResult {
    outputPort.displayMessage('Foo? Bar!');
    return new UseCaseResult(true);
  }
}

class FooMiddleware implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): UseCaseResult {
    console.log('Before interactor 1');

    var result = next(usecase);

    console.log('After interactor 1');

    return result;
  }
}

class FooMiddleware2 implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): UseCaseResult {
    console.log('Before interactor 2');

    var result = next(usecase);

    console.log('After interactor 2');

    return result;
  }
}

class FooMiddleware3 implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): UseCaseResult {
    outputPort.displayMessage('Terminate pipeline');
    return new UseCaseResult(false);
  }
}

class TerminatingGlobalMiddleware implements GlobalMiddleware {
  run<T>(usecase: T, next: any): UseCaseResult {
    return new UseCaseResult(false);
  }
}

var resolver = new SelfContainedResolver();

resolver.registerInteractor(new FooInteractor(), FooUseCase);
resolver.registerMiddleware(new FooMiddleware(), FooUseCase);
resolver.registerMiddleware(new FooMiddleware2(), FooUseCase);

// resolver.registerGlobalMiddleware(new TerminatingGlobalMiddleware()); // This Global middleware will terminate the pipeline
// resolver.registerMiddleware(new FooMiddleware3(), FooUseCase); // With this middleware registrered the interactor won't execute

var hub = new InteractorHub(resolver);

var result = hub.execute(new FooUseCase(), new FooOutputPort());

console.log(result.success);
