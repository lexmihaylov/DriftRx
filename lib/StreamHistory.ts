import { Subscription } from "rxjs";
import { StreamStore, StreamStoreEvent } from "./StreamStore";

export type StreamStoreStapshot = {
    [actioName: string]: any;
};

/**
 * Represents the history of a stream store, tracking changes and actions.
 */
export class StreamHistory {
    /**
     * Array to store snapshots of the stream store.
     * @private
     */
    private snapshots: StreamStoreStapshot[] = [];

    /**
     * Subscription object to listen for stream store events.
     * @private
     */
    private subscription: Subscription;

    /**
     * Creates an instance of StreamHistory.
     * @param {StreamStore} streamStore - The stream store to track.
     */
    constructor(private streamStore: StreamStore) {
        this.subscription = this.streamStore.storeEvents$.subscribe((event: StreamStoreEvent) => {
            const currentSnapshot = this.snapshots[this.snapshots.length - 1] || {};
            switch (event.type) {
                case 'actionCreated':
                case 'actionTriggered':
                    this.snapshots.push({
                        ...currentSnapshot,
                        [event.data.name]: event.data.changed
                    });
                    break;
                case 'actionDestroyed': {
                    const newSnapshot = { ...currentSnapshot };
                    delete newSnapshot[event.data.name];
                    this.snapshots.push(newSnapshot);
                    break;
                }
            }
        })
    }

    /**
     * Gets the length of the stream history (number of snapshots).
     * @returns {number} The length of the stream history.
     */
    getLength() {
        return this.snapshots.length;
    }

    /**
     * Gets the last snapshot in the stream history.
     * @returns {StreamStoreSnapshot} The last snapshot.
     */
    getLastSnapshot() {
        return this.snapshots[this.snapshots.length - 1];
    }

    /**
     * Gets a snapshot at a specific index in the stream history.
     * @param {number} index - The index of the desired snapshot.
     * @returns {StreamStoreSnapshot} The snapshot at the specified index.
     */
    getSnapshotByIndex(index: number) {
        return this.snapshots[index];
    }

    /**
     * Gets the full stream history as an array of snapshots.
     * @returns {StreamStoreSnapshot[]} The full stream history.
     */
    getFullHistory() {
        return this.snapshots;
    }

    /**
     * Restores the state of the StreamStore to a previous snapshot identified by the given index.
     * @param {number} index - The index of the desired snapshot to restore.
     * @throws {Error} Throws an error if the index is out of bounds, meaning there is no snapshot at the specified index.
     */
    restoreIndex(index: number) {
        const snapshot = this.getSnapshotByIndex(index);
        if (!snapshot) {
            throw new Error('Index out of bounds.')
        }

        Object.keys(snapshot).forEach((action) => this.streamStore.dispatch(action, snapshot[action]));
    }

    /**
     * Destroys the stream history by clearing snapshots and unsubscribing from events.
     */
    destroy() {
        this.snapshots = [];
        this.subscription.unsubscribe();
    }
}