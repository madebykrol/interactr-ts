# Interactr

> This is a typescript implementation of the C# package with the same name
> [InteractR](https://www.nuget.org/packages/InteractR/)

InteractR is a indirection, pipeline and mediation framework inspired by the ideas of "Clean architecture" and MediatR.
It is designed to separate the business / application specific logic from the presentation logic.

The idea is that you could create re-usable application componenets aka use cases that are independenten of infrastructure and presentation specifics.

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
  execute(usecase: MyUseCase, outputPort: MyOutputPort): UseCaseResult{
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
  run(usecase: MyUseCase, outputPort: MyOutputPort, next) {
    // Do something before next middleware / interactor
    next(usecase, outputPort);
    // Do something after
  }
}
```

### Resolver

## Registrating a usecase

## Registrating middleware

## Executing a usecase

```typescript
class MyComponent extends Component {
  constructor(private interactor: Hub, /* other params */) {}

  onLoginClick(): void {
    this.presenter.setComponent(this);

    this.interactor.execute(new LoginUseCase(username, password), presenter);

    this.presenter.present();
  }
}
```
