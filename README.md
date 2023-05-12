# DriftRx
DriftRx is a TypeScript library for managing application state using the observer pattern.

It provides an easy-to-use API for creating observable stores and subscribing to changes in the state of those stores. DriftRx is designed to be framework-agnostic, so it can be used in any JavaScript or TypeScript project.

## Features
* Simple and intuitive API for managing state
* Lightweight and easy to use
* Supports TypeScript out of the box
* Framework-agnostic

## Installation
You can install driftRx via npm:

```bash
npm install driftRx
```

Here's an example of how to use driftRx:

```typescript
import { StreamStore } from "driftRx";

const store = new StreamStore();

store.createAction("counter", 0);

const counter$ = store.action("counter");

const subscription = counter$.subscribe((value) => console.log(value));

store.dispatch("counter", 1);
store.dispatch("counter", 2);
store.dispatch("counter", 3);

subscription.unsubscribe();
```
## API

`StreamStore`
> The main class provided by driftRx. It manages the creation, observation, and dispatching of data to action streams.

`createAction(name: string, initialData: any): void`
> Creates a new action stream with the given name and initial data.

`createEffect<T>(actionName: string, effect: (actionData: T, store: StreamStore) => void): void`
> Registers a side effect that should be executed whenever a given action is dispatched.

`action<T>(name: string): Observable<T>`
> Gets an observable for the given action stream.

`dispatch<T>(name: string, payload: T): void`
> Dispatches data to the given action stream.

`destroyAction(name: string): void`
> Destroys the given action stream and all related data in the store.

`storeEvents$: Observable<StreamStoreEvent>`
> An observable for stream store events.

`StreamStoreEvent`
> An object representing a stream store event.

`type: StreamStoreEventName`
> The type of the stream store event.

`data: StreamStoreEventData`
> The data related to the stream store event.

`StreamStoreEventData`
> An object representing the data related to a stream store event.

`name: string`
> A string representing the name of the action stream related to the event.

`current?: any`
> The current data for the action stream related to the event.

`changed?: any`
> The changed data for the action stream related to the event.

## Testing
You can run the tests for driftRx by running the following command:

```bash
npm run test
```

## Contributing
Contributions to DriftRx are always welcome! If you find a bug or would like to suggest a new feature, please open an issue on the [GitHub repository](https://github.com/lexmihaylov/driftrx).

If you would like to contribute code to the project, please fork the repository and submit a pull request with your changes. Please ensure that your code follows the [contributing guidelines](https://github.com/lexmihaylov/driftrx/CONTRIBUTING.md) and passes all tests before submitting.

## License
DriftRx is released under the MIT License. See [LICENSE](https://github.com/lexmihaylov/driftrx/LICENSE) for more information.