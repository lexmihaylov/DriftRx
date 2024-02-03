import { Subscription } from "rxjs";
import { StreamStore, StreamStoreEvent } from "./StreamStore";

export type StreamStoreStapshot = {
    [actioName: string]: any;
};

export class StreamHistory {
    private snapshots: StreamStoreStapshot[] = [];
    private subscription: Subscription;
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
                case 'actionDestroyed':
                    const newSnapshot = { ...currentSnapshot };
                    delete newSnapshot[event.data.name];
                    this.snapshots.push(newSnapshot);
                    break;
            }
        })
    }

    getLength() {
        return this.snapshots.length;
    }

    getLastSnapshot() {
        return this.snapshots[this.snapshots.length - 1];
    }

    getSnapshotByIndex(index: number) {
        return this.snapshots[index];
    }

    getFullHistory() {
        return this.snapshots;
    }

    destroy() {
        this.snapshots = [];
        this.subscription.unsubscribe();
    }
}