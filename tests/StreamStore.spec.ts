import { StreamStore, StreamStoreEvent } from '../';
import { Observable } from 'rxjs';

describe('StreamStore', () => {
    let streamStore: StreamStore;

    beforeEach(() => {
        streamStore = new StreamStore();
    });

    describe('createAction', () => {
        it('should create a new action stream with the given name and initial data', () => {
            const name = 'myAction';
            const initialData = 'initialData';

            streamStore.createAction(name, initialData);

            expect(streamStore.action(name)).toBeDefined();
            expect(streamStore.action(name)).toBeInstanceOf(Observable);
        });

        it('should throw an error if a stream with the given name already exists', () => {
            const name = 'myAction';
            const initialData = 'initialData';

            streamStore.createAction(name, initialData);

            expect(() => {
                streamStore.createAction(name, initialData);
            }).toThrowError(`(StreamStore: ${name}) There is a stream with that name already registered`);
        });
    });

    describe('createEffect', () => {
        it('should register a side effect that should be executed whenever a given action is dispatched', () => {
            const name = 'myAction';
            const initialData = 'initialData';
            const effect = jest.fn();

            streamStore.createAction(name, initialData);
            streamStore.createEffect(name, effect);
            streamStore.dispatch(name, 'newData');

            expect(effect).toHaveBeenCalledTimes(2);
            expect(effect).nthCalledWith(1, 'initialData', streamStore);
            expect(effect).lastCalledWith('newData', streamStore);
        });
    });

    describe('action', () => {
        it('should get an observable for the given action stream', () => {
            const name = 'myAction';
            const initialData = 'initialData';

            streamStore.createAction(name, initialData);

            expect(streamStore.action(name)).toBeDefined();
            expect(streamStore.action(name)).toBeInstanceOf(Observable);
        });
    });

    describe('dispatch', () => {
        it('should dispatch data to the given action stream', () => {
            const name = 'myAction';
            const initialData = 'initialData';
            const newData = 'newData';

            streamStore.createAction(name, initialData);
            let actionData: any = null;
            streamStore.action(name).subscribe((data) => {
                actionData = data;
            });

            streamStore.dispatch(name, newData);
            expect(actionData).toEqual(newData);
        });

        it('should emit last value stored in the state when subscribed', () => {
            const action = 'myAction';
            const initData = {data: 'initialData'};
            streamStore.createAction(action, initData);

            streamStore.action(action).subscribe((data) => {
                expect(data).toEqual(initData);
            });
        });
    });

    describe('destroyAction', () => {
        it('should destroy the given action stream and all related data in the store', () => {
            const name = 'myAction';
            const initialData = 'initialData';

            streamStore.createAction(name, initialData);
            streamStore.destroyAction(name);

            expect(streamStore['storeData'][name]).not.toBeDefined();
            expect(streamStore['actions'][name]).not.toBeDefined();
        });
    });

    describe('storeEvents$', () => {
        it('should return an observable for stream store events', () => {
            const expectedEvents: StreamStoreEvent[] = [
                { type: 'actionCreated', data: { name: 'testAction' } },
                { type: 'actionTriggered', data: { name: 'testAction', current: undefined, changed: 'initData' } },
                { type: 'actionTriggered', data: { name: 'testAction', current: 'initData', changed: 'testData' } }
            ];
            const eventsObs = streamStore.storeEvents$;

            let actualEvents: StreamStoreEvent[] = [];
            eventsObs.subscribe((event: StreamStoreEvent) => {
                actualEvents.push(event);
            });

            streamStore.createAction('testAction', 'initData');
            streamStore.dispatch('testAction', 'testData');

            expect(actualEvents).toEqual(expectedEvents);
        });
    });
});