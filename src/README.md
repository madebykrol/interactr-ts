# Interactr v2.0.0

> This is a typescript implementation of the C# package with the same name
> [InteractR](https://www.nuget.org/packages/InteractR/)

InteractR is a indirection, pipeline and mediation framework inspired by the ideas of "Clean architecture" and MediatR.
It is designed to separate the business / application specific logic from the presentation logic.

The idea is that you could create re-usable application componenets aka use cases that are independenten of infrastructure and presentation specifics.

## Breaking changes in 2.0.0
1) Interactr library now utilizes "Promises" which makes the calls to hub.execute awaitable.
2) Changes to the file names has been made to make them consistent to comply with 'forceConsistentCasingInFileNames: true'

## Usage - Setting up your first usecase

There are 3 main components related to building applications using InteractR
1. Input (UseCase)
2. Interactor
3. Output (OutputPort)

Then there are the
1. Interactor Hub
2. Pipeline middleware
3. Resolver

When a use case is executed through the interactor hub. You pass in input (extension of UseCase) and a presenter (implementation of OutputPort)
The interactor then uses the inputdata to orchestrate some services, and eventually outputs data through the outputport.

### Usecase
> Idealy usecases should be immutable and validate their own data on construction.

```typescript
class MyUseCase extends UseCase<MyOutputPort> {
  
  readonly firstname: string;
  readonly lastname: string;

  constructor(firstname: string, lastname: string) {
    
    if(StringUtil.IsNullOrEmpty(firstname)) {
      throw new FirstnameEmptyOrNullException('Firstname must be set to a value');
	}

    if(StringUtil.IsNullOrEmpty(lastname)) {
     throw new LastnameEmptyOrNullException('Lastname must be set to a value');
	}
 
    this.firstname = firstname;
    this.lastname = lastname;
  }
}
```

### OutputPort
The outputport is a abstraction between the actual presentation and the application logic
and it's public API should be designed to best suit the application logic (The interactor) not the presentation.

> As interfaces don't really exist as a concept in runtime it is recommended to create these as pure abstract classes.
> Which simply means that they do not implement any methods or properties at all.

```typescript
abstract class MyOutputPort {
  abstract displayFullName(name: string): void;
}
```

### Interactor

```typescript
class MyUseCaseInteractor implements Interactor<MyUseCase, MyOutputPort> {
  execute(usecase: MyUseCase, outputPort: MyOutputPort): Promise<UseCaseResult>{
    outputPort.displayFullName(usecase.firstname + ' ' + usecase.lastname);
  }
}
```
### Hub
The interactor hub is the thing that makes InteractR work. It introduces a level of indirection to your application where interactors won't be called directly. They can. But they should not be.
It exposes a public method "execute" that takes a usecase and a outputport as parameters and outputs a UseCaseResult.

Typically you inject an instance of "Hub" into your components or controllers and then execute a usecase.

```typescript
class MyComponent extends Component {
  constructor(private interactor: Hub, /* other params */) {}
}
```

### Middleware
InteractR supports middleware pipelines. This means that you can register one or more middlewares to the execution pipeline, that will execute in the order of registration before and after the interactor executes.
When a Middleware executes it can choose to keep the execution flow by invoking the next delegate function or terminate the pipeline by just returning without invoking next.

```typescript
class MyUseCaseMiddleware implements Middleware<MyUseCase, MyOutputPort> {
  run(usecase: MyUseCase, outputPort: MyOutputPort, next): Promise<UseCaseResult> {
    // Do something before next middleware / interactor
    next(usecase, outputPort);
    // Do something after
  }
}
```

You can also create a global pipeline that executes for all usecases by implementing the GlobalMiddleware abstract class.

### Resolver
When a use case is executed the interactor is resolved through a resolver.
Either you can use the SelfContainedResolver where you register both Middleware and Interactors as instances or a resolver that uses a dependency injection container to resolve the instances. 
These are then called based on what Usecase you execute.

```typescript
let resolver = new SelfContainedResolver();

let interactorHub = new InteractorHub(resolver);

await interactorHub.execute(new MyUseCase(), new MyUseCaseOutputPortImpl());
```


## Registrating a interactor
Depending on what resolving strategy you might choose, the registration will be different. For example if your resolver uses a dependency injection container the instances will be resoler through that.
But the resolver that is part of the package exposes public methods to register Middlewere and Interactors and will contain instances of interactors and middleware within it self.

### SelfContainedResolver
```typescript
let resolver = new SelfContainedResolver();

resolver.registerInteractor(new MyUseCaseInteractor(), MyUseCase);
```

## Registrating middleware
You register middleware in the same way as interactors.

## Executing a usecase

```typescript
class MyComponent extends Component {
  constructor(private interactor: Hub, /* other params */) {}

  onLoginClick(): void {
    this.presenter.setComponent(this);

    await this.interactor.execute(new LoginUseCase(username, password), presenter);

    this.presenter.present();
  }
}
```

## Example code (app.ts)
```typescript
import { SelfContainedResolver } from './SelfContainedResolver';
import { UseCase } from './UseCase';
import { UseCaseResult } from './UseCaseResult';
import { Middleware, GlobalMiddleware } from './Middleware';
import { Interactor } from './Interactor';

import { InteractorHub } from './InteractorHub';

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

```