import { StreamHistory } from "../lib/StreamHistory";
import { StreamStore } from "../lib/StreamStore"

describe('StreamHistory', () => {
    let streamStore: StreamStore;
    let streamHistory: StreamHistory;

    beforeEach(() => {
        streamStore = new StreamStore();
        streamHistory = new StreamHistory(streamStore);
    });

    it('should create a history snapshot when creating an action.', () => {
        streamStore.createAction('testAction', { foo: 'bar' });
        const lastSnapshot = streamHistory.getLastSnapshot();
        expect(lastSnapshot).toBeDefined();
        expect(lastSnapshot.testAction).toBeDefined();
        expect(lastSnapshot.testAction.foo).toEqual('bar');
    });

    it('should create a new snapshot when an action is called.', () => {
        streamStore.createAction('testAction', { foo: 'bar' });
        streamStore.dispatch('testAction', { foo: 'bar-foo' });
        const lastSnapshot = streamHistory.getLastSnapshot();
        expect(streamHistory.getLength()).toEqual(3);
        expect(lastSnapshot).toBeDefined();
        expect(lastSnapshot.testAction).toBeDefined();
        expect(lastSnapshot.testAction.foo).toEqual('bar-foo');
    });

    it('should be able to provide a snapshot by providing an index.', () => {
        streamStore.createAction('testAction', { foo: 'bar' });
        streamStore.dispatch('testAction', { foo: 'bar-foo' });

        const snapshot0 = streamHistory.getSnapshotByIndex(0);
        expect(snapshot0).toBeDefined();
        expect('testAction' in snapshot0).toBeTruthy();
    });

    it('should handle action destructions.', () => {
        streamStore.createAction('testAction', { foo: 'bar' });
        streamStore.dispatch('testAction', { foo: 'bar-foo' });

        expect('testAction' in streamHistory.getLastSnapshot()).toBeTruthy();
        streamStore.destroyAction('testAction');
        expect(streamHistory.getLength()).toEqual(4);
        expect('testAction' in streamHistory.getLastSnapshot()).toBeFalsy();
    })

    it('should unsubscribe to store events and dispose of the history when destroyed.', () => {
        streamStore.createAction('testAction', { foo: 'bar' });
        streamStore.dispatch('testAction', { foo: 'bar-foo' });

        expect(streamHistory.getLength()).toEqual(3);
        streamHistory.destroy();
        expect(streamHistory.getLength()).toEqual(0);
    })
})