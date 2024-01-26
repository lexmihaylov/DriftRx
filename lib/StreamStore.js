"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamStore = void 0;
var rxjs_1 = require("rxjs");
/**
 * A store for managing and observing streams of data.
 */
var StreamStore = /** @class */ (function () {
    function StreamStore() {
        /**
         * A dictionary of registered stream subjects.
         */
        this.actions = {};
        /**
         * A dictionary of stored data for each stream.
         */
        this.storeData = {};
        /**
         * A subject for emitting stream store events.
         */
        this.storeEvents = new rxjs_1.Subject();
    }
    Object.defineProperty(StreamStore.prototype, "storeEvents$", {
        /**
         * An observable for stream store events.
         */
        get: function () {
            return this.storeEvents.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the data for a given action stream.
     * @param actionName The name of the action stream to set data for.
     * @param data The data to set for the action stream.
     */
    StreamStore.prototype.setStoreData = function (actionName, data) {
        this.emmitStoreEvent('actionTriggered', { name: actionName, current: this.storeData[actionName], changed: data });
        this.storeData[actionName] = Object.freeze(data);
    };
    /**
     * Emits a stream store event with the given type and data.
     * @param type The type of the stream store event.
     * @param data The data related to the stream store event.
     */
    StreamStore.prototype.emmitStoreEvent = function (type, data) {
        this.storeEvents.next({
            type: type,
            data: data
        });
    };
    /**
     * Creates a new action stream with the given name and initial data.
     * @param name The name of the action stream to create.
     * @param initialData The initial data for the action stream.
     * @throws An error if a stream with the given name already exists.
     */
    StreamStore.prototype.createAction = function (name, initialData) {
        if (this.actions[name]) {
            throw new Error("(StreamStore: ".concat(name, ") There is a stream with that name already registered"));
        }
        this.actions[name] = new rxjs_1.Subject();
        this.emmitStoreEvent('actionCreated', { name: name });
        this.dispatch(name, initialData);
    };
    /**
     * Registers a side effect that should be executed whenever a given action is dispatched
     * @template T - The type of data the action dispatches
     * @param {string} actionName - The name of the action to register the side effect for
     * @param {(actionData: T, store: StreamStore) => void} effect - A function that represents the side effect to execute when the action is dispatched
     * @returns {void}
     */
    StreamStore.prototype.createEffect = function (actionName, effect) {
        var _this = this;
        this.actions[actionName].subscribe(function (data) {
            _this.emmitStoreEvent('effectTriggered', { name: actionName });
            effect(data, _this);
        });
    };
    /**
     * Retrieves the latest data for a given action stream.
     * @template T - The type of data associated with the action stream.
     * @param {string} actionName - The name of the action stream to retrieve data for.
     * @returns {T} The data associated with the specified action stream.
     */
    StreamStore.prototype.data = function (actionName) {
        return this.storeData[actionName];
    };
    /**
     * Gets an observable for the given action stream.
     * @param actionName The name of the action stream to get an observable for.
     * @returns An observable for the action stream.
     */
    StreamStore.prototype.action = function (actionName) {
        return this.actions[actionName].asObservable().pipe((0, rxjs_1.startWith)(this.storeData[actionName]));
    };
    /**
     * Dispatches data to the given action stream.
     * @param actionName The name of the action stream to dispatch data to.
     * @param payload The data to dispatch to the action stream.
     */
    StreamStore.prototype.dispatch = function (actionName, payload) {
        this.setStoreData(actionName, payload);
        this.actions[actionName].next(this.storeData[actionName]);
    };
    /**
     * Destroys the given action stream and all related data in the store.
     * @param actionName The name of the action stream to destroy.
     */
    StreamStore.prototype.destroyAction = function (actionName) {
        this.actions[actionName].complete();
        delete this.storeData[actionName];
        delete this.actions[actionName];
        this.emmitStoreEvent('actionDestroyed', { name: actionName });
    };
    return StreamStore;
}());
exports.StreamStore = StreamStore;
