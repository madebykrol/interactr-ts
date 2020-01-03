import { SelfContainedResolver } from './selfcontained.resolver';
import { UseCase } from './usecase';
import { UseCaseResult } from './usecase.result';
import { Middleware } from './middleware';
import { Interactor } from './interactor';

import { InteractorHub } from './interactor.hub';

abstract class AbstractFooOutputPort {}

class FooOutputPort implements AbstractFooOutputPort {}

class FooUseCase extends UseCase<AbstractFooOutputPort> {}

class FooInteractor implements Interactor<FooUseCase, AbstractFooOutputPort> {
  execute(usecase: FooUseCase, outputPort: AbstractFooOutputPort): UseCaseResult {
    console.log("WHoop");

    return new UseCaseResult(true);
  }
}

class FooMiddleware implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): UseCaseResult {
    console.log("Before interactor 1");

    var result = next(usecase, outputPort);

    console.log("After interactor 1");

    return result;
  }
}

class FooMiddleware2 implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): UseCaseResult {
    console.log("Before interactor 2");

    var result = next(usecase, outputPort);

    console.log("After interactor 2");

    return result;
  }
}

class FooMiddleware3 implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): UseCaseResult {
    console.log("Terminate pipeline");
    return new UseCaseResult(false);
  }
}


var resolver = new SelfContainedResolver();

resolver.registerInteractor(new FooInteractor(), FooUseCase);
resolver.registerMiddleware(new FooMiddleware(), FooUseCase);
resolver.registerMiddleware(new FooMiddleware2(), FooUseCase);
// resolver.registerMiddleware(new FooMiddleware3(), FooUseCase); // With this middleware registrered the interactor won't execute

var hub = new InteractorHub(resolver);

var result = hub.execute(new FooUseCase(), new FooOutputPort());

console.log(result.success);
