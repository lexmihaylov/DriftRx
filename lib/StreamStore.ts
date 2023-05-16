import { Observable, Subject, startWith } from "rxjs";

/**
 * A string representing the type of stream store event.
 */
declare type StreamStoreEventName = 'actionCreated' | 'actionDestroyed' | 'effectTriggered' | 'actionTriggered';

/**
 * An object representing the data related to a stream store event.
 */
declare type StreamStoreEventData = {name: string, current?: any, changed?: any};

/**
 * An object representing a stream store event.
 */
export interface StreamStoreEvent {
    /**
     * The type of the stream store event.
     */
    type: StreamStoreEventName;
    
    /**
     * The data related to the stream store event.
     */
    data: StreamStoreEventData;
}

/**
 * A store for managing and observing streams of data.
 */
export class StreamStore {
    /**
     * A dictionary of registered stream subjects.
     */
    private actions: Record<string, Subject<any>> = {};

    /**
     * A dictionary of stored data for each stream.
     */
    private storeData: Record<string, any> = {};

    /**
     * A subject for emitting stream store events.
     */
    private storeEvents = new Subject<StreamStoreEvent>();

    /**
     * An observable for stream store events.
     */
    get storeEvents$(): Observable<StreamStoreEvent> {
        return this.storeEvents.asObservable();
    }

    /**
     * Sets the data for a given action stream.
     * @param actionName The name of the action stream to set data for.
     * @param data The data to set for the action stream.
     */
    private setStoreData<T>(actionName: string, data: T): void {
        this.emmitStoreEvent('actionTriggered', {name: actionName, current: this.storeData[actionName], changed: data})
        this.storeData[actionName] = Object.freeze(data);
    }

    /**
     * Emits a stream store event with the given type and data.
     * @param type The type of the stream store event.
     * @param data The data related to the stream store event.
     */
    private emmitStoreEvent(type: StreamStoreEventName, data: StreamStoreEventData): void {
        this.storeEvents.next({
            type: type,
            data: data
        });
    }

    /**
     * Creates a new action stream with the given name and initial data.
     * @param name The name of the action stream to create.
     * @param initialData The initial data for the action stream.
     * @throws An error if a stream with the given name already exists.
     */
    createAction<T>(name: string, initialData: T): void {
        if (this.actions[name]) {
            throw new Error(`(StreamStore: ${name}) There is a stream with that name already registered`);
        }

        this.actions[name] = new Subject<T>();
        this.emmitStoreEvent('actionCreated', { name: name });
        this.dispatch<T>(name, initialData);

    }

    /**
     * Registers a side effect that should be executed whenever a given action is dispatched
     * @template T - The type of data the action dispatches
     * @param {string} actionName - The name of the action to register the side effect for
     * @param {(actionData: T, store: StreamStore) => void} effect - A function that represents the side effect to execute when the action is dispatched
     * @returns {void}
     */
    createEffect<T>(actionName: string, effect: (actionData: T, store: StreamStore) => void): void {
        this.actions[actionName].subscribe((data: T) => {
            this.emmitStoreEvent('effectTriggered', {name: actionName});
            effect(data, this);
        });
    }

    /**
     * Retrieves the latest data for a given action stream.
     * @template T - The type of data associated with the action stream.
     * @param {string} actionName - The name of the action stream to retrieve data for.
     * @returns {T} The data associated with the specified action stream.
     */
    data<T>(actionName: string): T {
        return this.storeData[actionName] as T;
    }

    /**
     * Gets an observable for the given action stream.
     * @param actionName The name of the action stream to get an observable for.
     * @returns An observable for the action stream.
     */
    action<T>(actionName: string): Observable<T> {
        return this.actions[actionName].asObservable().pipe<T>(startWith(this.storeData[actionName]));
    }

    /**
     * Dispatches data to the given action stream.
     * @param actionName The name of the action stream to dispatch data to.
     * @param payload The data to dispatch to the action stream.
     */
    dispatch<T>(actionName: string, payload: T): void {
        this.setStoreData<T>(actionName, payload);
        this.actions[actionName].next(this.storeData[actionName]);
    }

    /**
     * Destroys the given action stream and all related data in the store.
     * @param actionName The name of the action stream to destroy.
     */
    destroyAction(actionName: string): void {
        this.actions[actionName].complete();
        delete this.storeData[actionName];
        delete this.actions[actionName];

        this.emmitStoreEvent('actionDestroyed', {name: actionName});
    }
}