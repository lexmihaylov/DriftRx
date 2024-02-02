import { StreamStore } from "../lib/StreamStore";
import { StreamDebugLogger } from "../lib/StreamDebugLogger";

describe('StreamDebugLogger', () => {
    let streamStore: StreamStore;
    let logger: StreamDebugLogger;

    beforeEach(() => {
        streamStore = new StreamStore();
        logger = new StreamDebugLogger(streamStore);
    });

    it('should use console.info to log messages', () => {
        const message = 'message';
        const loggerLog = jest.spyOn(logger, 'log');
        logger.log(message);

        expect(loggerLog).toHaveBeenCalledWith(message);
    });

    it('should log data changes', () => {
        const actionName = 'testAction';
        const oldData = { foo: 'bar' };
        const newData = { foo: 'baz' };
        streamStore.createAction(actionName, oldData);
        const consoleSpy = jest.spyOn(console, 'info');
        streamStore.dispatch(actionName, newData);
        expect(consoleSpy).toHaveBeenCalledWith(`[${actionName}] triggered: `, oldData, newData);
    });

    it('should log action creation', () => {
        const actionName = 'testAction';

        const consoleSpy = jest.spyOn(console, 'info');
        streamStore.createAction(actionName, { foo: 'bar' });
        logger.logActionCreation(actionName);
        expect(consoleSpy).toHaveBeenCalledWith(`[${actionName}] action created`);
    });

    it('should log action destruction', () => {
        const actionName = 'testAction';
        streamStore.createAction(actionName, {});

        const consoleSpy = jest.spyOn(console, 'info');
        streamStore.destroyAction(actionName);
        logger.logActionDestruction(actionName);
        expect(consoleSpy).toHaveBeenCalledWith(`[${actionName}] destroyed`);
    });

    it('should log effect triggering', () => {
        const actionName = 'testAction';
        streamStore.createAction(actionName, null);
        const consoleSpy = jest.spyOn(console, 'info');
        streamStore.createEffect(actionName, () => { });
        streamStore.dispatch(actionName, null);
        logger.logEffect(actionName);
        expect(consoleSpy).toHaveBeenCalledWith(`[${actionName}] effect triggered`);
    });
});