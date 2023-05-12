import { StreamStore } from "./StreamStore";

/**
 * A class for logging stream debug messages.
 */
export class StreamDebugLogger {
    /**
     * Creates a new instance of StreamDebugLogger.
     * @param streamStore The StreamStore instance to listen for events from.
     */
    constructor(private streamStore: StreamStore) {
        this.streamStore.storeEvents$.subscribe((event) => {
            switch(event.type) {
                case 'actionCreated':
                    this.logActionCreation(event.data.name);
                    break;
                case 'actionDestroyed':
                    this.logActionDestruction(event.data.name);
                    break;
                case 'actionTriggered':
                    this.logDataChanges(event.data.name, event.data.current, event.data.changed);
                    break;
                case 'effectTriggered':
                    this.logEffect(event.data.name);
            }
        })
    }

    /**
     * Logs a message to the console.
     * @param message The message to log.
     */
    log(message: string) {
        console.info(
            `[StreamStrore]${message}`
        );
    }

    /**
     * Logs changes to the data in a stream.
     * @param actionName The name of the stream that was triggered.
     * @param oldData The previous data in the stream.
     * @param newData The new data in the stream.
     */
    logDataChanges(actionName: string, oldData, newData: any) {
        console.info(`[${actionName}] triggered: `, oldData, newData);
    }

    /**
     * Logs the creation of a new stream.
     * @param actionName The name of the stream that was created.
     */
    logActionCreation(actionName: string) {
        console.info(`[${actionName}] action created`);
    }

    /**
     * Logs the destruction of a stream.
     * @param actioName The name of the stream that was destroyed.
     */
    logActionDestruction(actioName: string) {
        console.info(`[${actioName}] destroyed`)
    }

    /**
     * Logs the triggering of an effect.
     * @param actionName The name of the stream that triggered the effect.
     */
    logEffect(actionName: string) {
        console.info(`[${actionName}] effect triggered`);
    }
}