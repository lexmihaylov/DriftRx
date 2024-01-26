"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDebugLogger = void 0;
/**
 * A class for logging stream debug messages.
 */
var StreamDebugLogger = /** @class */ (function () {
    /**
     * Creates a new instance of StreamDebugLogger.
     * @param streamStore The StreamStore instance to listen for events from.
     */
    function StreamDebugLogger(streamStore) {
        var _this = this;
        this.streamStore = streamStore;
        this.streamStore.storeEvents$.subscribe(function (event) {
            switch (event.type) {
                case 'actionCreated':
                    _this.logActionCreation(event.data.name);
                    break;
                case 'actionDestroyed':
                    _this.logActionDestruction(event.data.name);
                    break;
                case 'actionTriggered':
                    _this.logDataChanges(event.data.name, event.data.current, event.data.changed);
                    break;
                case 'effectTriggered':
                    _this.logEffect(event.data.name);
            }
        });
    }
    /**
     * Logs a message to the console.
     * @param message The message to log.
     */
    StreamDebugLogger.prototype.log = function (message) {
        console.info("[StreamStrore]".concat(message));
    };
    /**
     * Logs changes to the data in a stream.
     * @param actionName The name of the stream that was triggered.
     * @param oldData The previous data in the stream.
     * @param newData The new data in the stream.
     */
    StreamDebugLogger.prototype.logDataChanges = function (actionName, oldData, newData) {
        console.info("[".concat(actionName, "] triggered: "), oldData, newData);
    };
    /**
     * Logs the creation of a new stream.
     * @param actionName The name of the stream that was created.
     */
    StreamDebugLogger.prototype.logActionCreation = function (actionName) {
        console.info("[".concat(actionName, "] action created"));
    };
    /**
     * Logs the destruction of a stream.
     * @param actioName The name of the stream that was destroyed.
     */
    StreamDebugLogger.prototype.logActionDestruction = function (actioName) {
        console.info("[".concat(actioName, "] destroyed"));
    };
    /**
     * Logs the triggering of an effect.
     * @param actionName The name of the stream that triggered the effect.
     */
    StreamDebugLogger.prototype.logEffect = function (actionName) {
        console.info("[".concat(actionName, "] effect triggered"));
    };
    return StreamDebugLogger;
}());
exports.StreamDebugLogger = StreamDebugLogger;
