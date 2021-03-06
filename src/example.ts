import { 
  Interactor, 
  InteractorHub, 
  Middleware, 
  GlobalMiddleware, 
  UseCaseResult, 
  UseCase, 
  SelfContainedResolver 
} from './';

abstract class AbstractFooOutputPort {
  abstract displayMessage(message: string): void;
}

abstract class AbstractBarOutputPort {
  abstract displayMessage(message: string): void;
}

class FooOutputPort implements AbstractFooOutputPort {
  displayMessage(message: string): void { console.log(message); }
}

class FooUseCase extends UseCase<AbstractFooOutputPort> {
  constructor(public fooParam: string) {
    super();
  }
}

class FooInteractor implements Interactor<FooUseCase, AbstractFooOutputPort> {
  async execute(usecase: FooUseCase, outputPort: AbstractFooOutputPort): Promise<UseCaseResult> {
    outputPort.displayMessage('Foo?');
    return new UseCaseResult(true);
  }
}

class BarOutputPort implements AbstractBarOutputPort {
  displayMessage(message: string): void { console.log(message); }
}

class BarUseCase extends UseCase<AbstractBarOutputPort> {}

class BarInteractor implements Interactor<BarUseCase, AbstractBarOutputPort> {
  async execute(usecase: BarUseCase, outputPort: AbstractBarOutputPort): Promise<UseCaseResult> {
    outputPort.displayMessage('Bar!');
    return new UseCaseResult(true);
  }
}

class FooMiddleware implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): Promise<UseCaseResult> {
    console.log('Before foo interactor 1');

    var result = next(usecase);

    console.log('After foo interactor 1');

    return result;
  }
}

class FooMiddleware2 implements Middleware<FooUseCase, AbstractFooOutputPort> {
  run(usecase: FooUseCase, outputPort: AbstractFooOutputPort, next: any): Promise<UseCaseResult> {
    console.log('Before foo interactor 2');

    var result = next(usecase);

    console.log('After foo interactor 2');

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
  resolver.registerInteractor(new BarInteractor(), BarUseCase);
  resolver.registerMiddleware(new FooMiddleware(), FooUseCase);
  resolver.registerMiddleware(new FooMiddleware2(), FooUseCase);

// resolver.registerGlobalMiddleware(new TerminatingGlobalMiddleware()); // This Global middleware will terminate the pipeline
// resolver.registerMiddleware(new FooMiddleware3(), FooUseCase); // With this middleware registrered the interactor won't execute

  var hub = new InteractorHub(resolver);

  var fooResult = await hub.execute(new FooUseCase("Foo input"), new FooOutputPort());

  var barResult = await hub.execute(new BarUseCase(), new BarOutputPort());

  console.log(fooResult.success);
  console.log(barResult.success);
}

run();